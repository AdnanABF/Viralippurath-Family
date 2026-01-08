import {
  Injectable,
  NotFoundException,
  BadRequestException,
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
import {
  ActivityAction,
  EntityType,
} from '../activity-log/schemas/activity-log.schema';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Gallery.name)
    private galleryModel: Model<GalleryDocument>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly activityLogService: ActivityLogService,
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
  }) {
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

    // 1. Exact Match Filters
    if (status && status !== 'ALL') {
      filters.status = status;
    }
    if (album && album !== 'ALL') {
      filters.album = album;
    }

    // 2. Search Logic (Caption or Album)
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      filters.$or = [{ caption: searchRegex }, { album: searchRegex }];
    }

    // 3. Date Range Logic (createdAt)
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) {
        filters.createdAt.$gte = new Date(startDate);
      }
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

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      meta: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: Number(page),
      },
    };
  }

  async create(
    dto: CreateGalleryDto,
    file: Express.Multer.File,
    admin: { userUuid: string; username: string },
  ) {
    if (!file) {
      throw new BadRequestException(
        'Image file is required for gallery creation',
      );
    }

    const cloudResponse = await this.cloudinaryService.uploadFile(
      file,
      'gallery',
    );

    const newGallery = new this.galleryModel({
      ...dto,
      imageUrl: cloudResponse.secure_url,
      publicId: cloudResponse.public_id,
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
      message: 'Gallery item uploaded successfully',
    };
  }

  async update(
    uuid: string,
    dto: UpdateGalleryDto,
    admin: { userUuid: string; username: string },
    file?: Express.Multer.File,
  ) {
    const existing = await this.galleryModel.findOne({ uuid }).exec();
    if (!existing) {
      throw new NotFoundException(`Gallery image with UUID ${uuid} not found`);
    }

    let updateData = { ...dto } as any;

    if (file) {
      if (existing.publicId) {
        await this.cloudinaryService.deleteFile(existing.publicId);
      }
      const cloudResponse = await this.cloudinaryService.uploadFile(file);
      updateData.imageUrl = cloudResponse.secure_url;
      updateData.publicId = cloudResponse.public_id;
    }

    const updated = await this.galleryModel
      .findOneAndUpdate({ uuid }, { $set: updateData }, { new: true })
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
  }

  async remove(uuid: string, admin: { userUuid: string; username: string }) {
    const existing = await this.galleryModel.findOne({ uuid }).exec();
    if (!existing) {
      throw new NotFoundException(`Gallery image with UUID ${uuid} not found`);
    }

    if (existing.publicId) {
      await this.cloudinaryService.deleteFile(existing.publicId);
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
  }

  // ===== PUBLIC METHODS =====
  async findPublished() {
    return await this.galleryModel
      .find({ status: GalleryStatus.PUBLISHED })
      .select('uuid imageUrl caption album year -_id')
      .sort({ year: -1, createdAt: -1 })
      .exec();
  }
}
