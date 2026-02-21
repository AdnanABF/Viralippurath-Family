import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Gallery,
  GalleryDocument,
  GalleryStatus,
} from './schemas/gallery.schema';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { SystemLogService } from '../system-log/system-log.service';
import {
  ActivityAction,
  EntityType,
} from '../activity-log/schemas/activity-log.schema';

@Injectable()
export class GalleryService {
  private readonly logger = new Logger(GalleryService.name);

  constructor(
    @InjectModel(Gallery.name)
    private galleryModel: Model<GalleryDocument>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly activityLogService: ActivityLogService,
    private readonly systemLogService: SystemLogService,
  ) {}

  // ===== ADMIN METHODS =====

  async findAllAdmin(query: {
    page?: number;
    limit?: number;
    status?: string;
    album?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    adminUserUuid?: string;
  }) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        album,
        search,
        startDate,
        endDate,
      } = query;

      const skip = (page - 1) * limit;
      const filters: any = {};

      if (status && status !== 'ALL') filters.status = status;
      if (album && album !== 'ALL') filters.album = album;

      if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        filters.$or = [{ caption: searchRegex }, { album: searchRegex }];
      }

      if (startDate || endDate) {
        filters.createdAt = {};
        if (startDate) filters.createdAt.$gte = new Date(startDate);
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          filters.createdAt.$lte = end;
        }
      }

      const [data, totalItems] = await Promise.all([
        this.galleryModel
          .find(filters)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.galleryModel.countDocuments(filters).exec(),
      ]);

      return {
        data,
        meta: {
          totalItems,
          itemCount: data.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: Number(page),
        },
      };
    } catch (error) {
      await this.handleError(
        error,
        'GET',
        '/admin/gallery',
        query,
        query.adminUserUuid,
      );
      throw new InternalServerErrorException('Failed to fetch gallery items');
    }
  }

  /**
   * Creates a gallery entry. Image is already uploaded by the client.
   */
  async create(
    dto: CreateGalleryDto,
    admin: { userUuid: string; username: string },
  ) {
    try {
      // Create record with URLs provided by the frontend
      const newGallery = new this.galleryModel({
        ...dto,
        publicId: dto.cloudinaryPublicId, // Map DTO to Schema field
      });

      const savedGallery = await newGallery.save();

      await this.activityLogService.create({
        adminUuid: admin.userUuid,
        adminUserName: admin.username,
        action: ActivityAction.CREATE,
        entityType: EntityType.GALLERY,
        entityTitle: savedGallery.caption || 'New Photo',
        entityUuid: savedGallery.uuid,
      });

      return {
        data: savedGallery,
        message: 'Gallery item saved successfully',
      };
    } catch (error) {
      await this.handleError(
        error,
        'POST',
        '/admin/gallery',
        dto,
        admin.userUuid,
      );
      throw new InternalServerErrorException('Failed to save gallery item');
    }
  }

  /**
   * Updates a gallery entry. If imageUrl is provided, old asset is deleted from Cloudinary.
   */
  async update(
    uuid: string,
    dto: UpdateGalleryDto,
    admin: { userUuid: string; username: string },
  ) {
    try {
      const existing = await this.galleryModel.findOne({ uuid }).exec();
      if (!existing) throw new NotFoundException('Gallery item not found');

      const updateData = { ...dto } as any;

      // Handle Cloudinary cleanup if a new image was uploaded by client
      if (dto.imageUrl && dto.cloudinaryPublicId) {
        if (existing.publicId && existing.publicId !== dto.cloudinaryPublicId) {
          await this.cloudinaryService.deleteFile(existing.publicId);
        }
        updateData.publicId = dto.cloudinaryPublicId;
      }

      const updated = await this.galleryModel
        .findOneAndUpdate(
          { uuid },
          { $set: updateData },
          { new: true, runValidators: true },
        )
        .exec();

      if (updated) {
        await this.activityLogService.create({
          adminUuid: admin.userUuid,
          adminUserName: admin.username,
          action: ActivityAction.UPDATE,
          entityType: EntityType.GALLERY,
          entityTitle: updated.caption || 'Updated Photo',
          entityUuid: updated.uuid,
        });
      }

      return {
        data: updated,
        message: 'Gallery item updated successfully',
      };
    } catch (error) {
      await this.handleError(
        error,
        'PATCH',
        `/admin/gallery/${uuid}`,
        dto,
        admin.userUuid,
      );

      if (error.getStatus && typeof error.getStatus === 'function') {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update gallery item');
    }
  }

  async remove(uuid: string, admin: { userUuid: string; username: string }) {
    let cloudResponse: any;
    try {
      const existing = await this.galleryModel.findOne({ uuid }).exec();
      if (!existing) throw new NotFoundException('Gallery item not found');

      // Cleanup Cloudinary asset
      if (existing.publicId) {
        cloudResponse = await this.cloudinaryService.deleteFile(
          existing.publicId,
        );
      }

      await this.galleryModel.findOneAndDelete({ uuid }).exec();

      await this.activityLogService.create({
        adminUuid: admin.userUuid,
        adminUserName: admin.username,
        action: ActivityAction.DELETE,
        entityType: EntityType.GALLERY,
        entityTitle: existing.caption || 'Deleted Photo',
        entityUuid: existing.uuid,
      });

      return {
        data: { deleted: true },
        message: 'Gallery item removed successfully',
      };
    } catch (error) {
      await this.handleError(
        error,
        'DELETE',
        `/admin/gallery/${uuid}`,
        cloudResponse,
        admin.userUuid,
      );

      if (error.getStatus && typeof error.getStatus === 'function') {
        throw error;
      }
      throw new InternalServerErrorException('Failed to remove gallery item');
    }
  }

  // ===== PUBLIC METHODS =====

  async findPublished(query: {
    album?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const { album = 'ALL', page = 1, limit = 12 } = query;
      const skip = (page - 1) * limit;

      // Base filter for the view
      const viewFilter = { status: GalleryStatus.PUBLISHED };

      // Filter for the actual data (includes album selection)
      const dataFilter: any = { ...viewFilter };
      if (album !== 'ALL') {
        dataFilter.album = album;
      }

      const result = await this.galleryModel
        .aggregate([
          {
            $facet: {
              // Lane 1: Paginated Data (The photos currently being viewed)
              data: [
                { $match: dataFilter },
                { $sort: { year: -1, createdAt: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                  $project: {
                    _id: 0,
                    uuid: 1,
                    imageUrl: 1,
                    caption: 1,
                    album: 1,
                    year: 1,
                  },
                },
              ],
              // Lane 2: Total count for this specific filter (tells infinite scroll when to stop)
              totalCount: [{ $match: dataFilter }, { $count: 'count' }],
              // Lane 3: Count per album (for the filter pills)
              albumCounts: [
                { $match: viewFilter },
                { $group: { _id: '$album', count: { $sum: 1 } } },
              ],
            },
          },
        ])
        .exec();

      const totalItems = result[0].totalCount[0]?.count || 0;
      const rawAlbumCounts = result[0].albumCounts || [];

      const formattedAlbumCounts = rawAlbumCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {});

      return {
        data: result[0].data,
        meta: {
          totalItems,
          itemCount: result[0].data.length,
          itemsPerPage: Number(limit),
          totalPages: Math.ceil(totalItems / limit),
          currentPage: Number(page),
          albumCounts: formattedAlbumCounts,
          totalInView: Object.values(formattedAlbumCounts).reduce(
            (a: number, b: number) => a + b,
            0,
          ) as number,
        },
      };
    } catch (error) {
      await this.handleError(error, 'GET', '/public/gallery', query, 'GUEST');
      throw new InternalServerErrorException('Failed to fetch gallery');
    }
  }

  private async handleError(
    error: any,
    method: string,
    path: string,
    payload: any,
    userUuid?: string,
  ) {
    this.logger.error(
      `${method} ${path} failed: ${error.message}`,
      error.stack,
    );
    await this.systemLogService.log({
      errorCode: error.code?.toString() || error.name || '500',
      message: error.message,
      stack: error.stack,
      path,
      method,
      payload,
      userUuid: userUuid || 'SYSTEM',
    });
  }
}
