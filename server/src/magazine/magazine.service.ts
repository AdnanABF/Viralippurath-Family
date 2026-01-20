import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Magazine,
  MagazineDocument,
  MagazineStatus,
} from './schemas/magazine.schema';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { SystemLogService } from '../system-log/system-log.service';
import {
  ActivityAction,
  EntityType,
} from '../activity-log/schemas/activity-log.schema';

@Injectable()
export class MagazineService {
  private readonly logger = new Logger(MagazineService.name);

  constructor(
    @InjectModel(Magazine.name)
    private magazineModel: Model<MagazineDocument>,
    private cloudinaryService: CloudinaryService,
    private readonly activityLogService: ActivityLogService,
    private readonly systemLogService: SystemLogService,
  ) {}

  // ===== PUBLIC METHODS =====
  async findPublished() {
    try {
      return await this.magazineModel
        .find({ status: MagazineStatus.PUBLISHED })
        .select('uuid title_en title_ml publishedDate pdfUrl -_id')
        .sort({ publishedDate: -1 })
        .exec();
    } catch (error) {
      await this.handleError(error, 'GET', '/public/magazines', null, 'GUEST');
      throw new InternalServerErrorException(
        'Failed to fetch published magazines',
      );
    }
  }

  // ===== ADMIN METHODS =====
  async findAllAdmin(query: {
    page?: number;
    limit?: number;
    status?: string;
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
        search,
        startDate,
        endDate,
      } = query;

      const skip = (page - 1) * limit;
      const filters: any = {};

      if (status && status !== 'ALL') filters.status = status;

      if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        filters.$or = [{ title_en: searchRegex }, { title_ml: searchRegex }];
      }

      if (startDate || endDate) {
        filters.publishedDate = {};
        if (startDate) filters.publishedDate.$gte = new Date(startDate);
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          filters.publishedDate.$lte = end;
        }
      }

      const [data, totalItems] = await Promise.all([
        this.magazineModel
          .find(filters)
          .sort({ publishedDate: -1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.magazineModel.countDocuments(filters).exec(),
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
        '/admin/magazines',
        query,
        query.adminUserUuid,
      );
      throw new InternalServerErrorException(
        'Failed to fetch magazine records',
      );
    }
  }

  async create(
    dto: CreateMagazineDto,
    admin: { userUuid: string; username: string },
  ) {
    try {
      const magazine = await this.magazineModel.create(dto);

      await this.activityLogService.create({
        adminUuid: admin.userUuid,
        adminUserName: admin.username,
        action: ActivityAction.CREATE,
        entityType: EntityType.MAGAZINE,
        entityTitle: magazine.title_en,
        entityUuid: magazine.uuid,
      });

      return {
        data: magazine,
        message: 'Magazine issue created successfully',
      };
    } catch (error) {
      await this.handleError(
        error,
        'POST',
        '/admin/magazines',
        dto,
        admin.userUuid,
      );
      throw new InternalServerErrorException('Failed to create magazine issue');
    }
  }

  async update(
    uuid: string,
    dto: UpdateMagazineDto,
    admin: { userUuid: string; username: string },
  ) {
    let cloudResponse: any;
    try {
      const magazine = await this.magazineModel.findOne({ uuid }).exec();
      if (!magazine) {
        throw new NotFoundException(`Magazine with UUID ${uuid} not found`);
      }

      // Handle old file cleanup if public ID changed
      if (
        dto.cloudinaryPublicId &&
        magazine.cloudinaryPublicId !== dto.cloudinaryPublicId
      ) {
        if (magazine.cloudinaryPublicId) {
          cloudResponse = await this.cloudinaryService
            .deleteFile(magazine.cloudinaryPublicId, 'image')
            .catch((err) =>
              this.logger.error(
                `Failed to delete old Cloudinary file: ${magazine.cloudinaryPublicId}`,
                err,
              ),
            );
        }
      }

      const updated = await this.magazineModel
        .findOneAndUpdate(
          { uuid },
          { $set: dto },
          { new: true, runValidators: true },
        )
        .exec();

      if (updated) {
        await this.activityLogService.create({
          adminUuid: admin.userUuid,
          adminUserName: admin.username,
          action: ActivityAction.UPDATE,
          entityType: EntityType.MAGAZINE,
          entityTitle: updated.title_en,
          entityUuid: updated.uuid,
        });
      }

      return {
        data: updated,
        message: 'Magazine issue updated successfully',
      };
    } catch (error) {
      await this.handleError(
        error,
        'PATCH',
        `/admin/magazines/${uuid}`,
        { ...dto, cloudResponse },
        admin.userUuid,
      );

      if (error.getStatus && typeof error.getStatus === 'function') {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update magazine issue');
    }
  }

  async remove(uuid: string, admin: { userUuid: string; username: string }) {
    let cloudResponse: any;
    try {
      const magazine = await this.magazineModel.findOne({ uuid }).exec();
      if (!magazine) {
        throw new NotFoundException(`Magazine with UUID ${uuid} not found`);
      }

      if (magazine.cloudinaryPublicId) {
        cloudResponse = await this.cloudinaryService.deleteFile(
          magazine.cloudinaryPublicId,
          'image',
        );
      }

      await this.magazineModel.findOneAndDelete({ uuid }).exec();

      await this.activityLogService.create({
        adminUuid: admin.userUuid,
        adminUserName: admin.username,
        action: ActivityAction.DELETE,
        entityType: EntityType.MAGAZINE,
        entityTitle: magazine.title_en,
        entityUuid: magazine.uuid,
      });

      return {
        data: { success: true },
        message: 'Magazine issue removed successfully',
      };
    } catch (error) {
      await this.handleError(
        error,
        'DELETE',
        `/admin/magazines/${uuid}`,
        cloudResponse,
        admin.userUuid,
      );

      if (error.getStatus && typeof error.getStatus === 'function') {
        throw error;
      }
      throw new InternalServerErrorException('Failed to remove magazine issue');
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
