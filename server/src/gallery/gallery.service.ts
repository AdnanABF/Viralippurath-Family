import {
  Injectable,
  NotFoundException,
  BadRequestException,
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

  async create(
    dto: CreateGalleryDto,
    file: Express.Multer.File,
    admin: { userUuid: string; username: string },
  ) {
    let cloudResponse: any;
    try {
      if (!file) throw new BadRequestException('Image file is required');

      // 1. Upload to Cloudinary
      cloudResponse = await this.cloudinaryService.uploadFile(file, 'gallery');

      // 2. Save to Database
      const newGallery = new this.galleryModel({
        ...dto,
        imageUrl: cloudResponse.secure_url,
        publicId: cloudResponse.public_id,
      });

      const savedGallery = await newGallery.save();

      // 3. Activity Log
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
        message: 'Gallery item uploaded successfully',
      };
    } catch (error) {
      await this.handleError(
        error,
        'POST',
        '/admin/gallery',
        { ...dto, cloudResponse },
        admin.userUuid,
      );

      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to upload gallery item');
    }
  }

  async update(
    uuid: string,
    dto: UpdateGalleryDto,
    admin: { userUuid: string; username: string },
    file?: Express.Multer.File,
  ) {
    let cloudResponse: any;
    try {
      const existing = await this.galleryModel.findOne({ uuid }).exec();
      if (!existing) throw new NotFoundException('Gallery item not found');

      let updateData = { ...dto } as any;

      if (file) {
        if (existing.publicId) {
          await this.cloudinaryService.deleteFile(existing.publicId);
        }
        cloudResponse = await this.cloudinaryService.uploadFile(
          file,
          'gallery',
        );
        updateData.imageUrl = cloudResponse.secure_url;
        updateData.publicId = cloudResponse.public_id;
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
        { ...dto, cloudResponse },
        admin.userUuid,
      );

      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update gallery item');
    }
  }

  async remove(uuid: string, admin: { userUuid: string; username: string }) {
    let cloudResponse: any;
    try {
      const existing = await this.galleryModel.findOne({ uuid }).exec();
      if (!existing) throw new NotFoundException('Gallery item not found');

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

      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to remove gallery item');
    }
  }

  // ===== PUBLIC METHODS =====
  async findPublished() {
    try {
      return await this.galleryModel
        .find({ status: GalleryStatus.PUBLISHED })
        .select('uuid imageUrl caption album year -_id')
        .sort({ year: -1, createdAt: -1 })
        .exec();
    } catch (error) {
      await this.handleError(error, 'GET', '/public/gallery', null, 'GUEST');
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
