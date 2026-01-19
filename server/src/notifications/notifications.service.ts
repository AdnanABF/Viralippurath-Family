import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
  NotificationStatus,
} from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification-dto';
import { UpdateNotificationDto } from './dto/update-notification-dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { SystemLogService } from '../system-log/system-log.service';
import {
  ActivityAction,
  EntityType,
} from '../activity-log/schemas/activity-log.schema';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private readonly activityLogService: ActivityLogService,
    private readonly systemLogService: SystemLogService,
  ) {}

  // ===== ADMIN - Paginated with Filters and Search =====

  async findAllAdmin(query: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
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
        category,
        search,
        startDate,
        endDate,
      } = query;
      const skip = (page - 1) * limit;

      const filters: any = {};

      if (status && status !== 'ALL') filters.status = status;
      if (category && category !== 'ALL') filters.category = category;

      if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        filters.$or = [
          { title_en: searchRegex },
          { title_ml: searchRegex },
          { content_en: searchRegex },
          { content_ml: searchRegex },
        ];
      }

      if (startDate || endDate) {
        filters.date = {};
        if (startDate) filters.date.$gte = new Date(startDate);
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          filters.date.$lte = end;
        }
      }

      const [data, totalItems] = await Promise.all([
        this.notificationModel
          .find(filters)
          .sort({ isPinned: -1, category: -1, date: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.notificationModel.countDocuments(filters).exec(),
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
        '/admin/notifications',
        query,
        query.adminUserUuid,
      );
      throw new InternalServerErrorException('Failed to fetch notifications');
    }
  }

  async create(
    dto: CreateNotificationDto,
    admin: { userUuid: string; username: string },
  ) {
    try {
      if (new Date(dto.expiresAt) <= new Date(dto.date)) {
        throw new BadRequestException(
          'Expiry date must be equal to or after publish date',
        );
      }

      const notification = await this.notificationModel.create(dto);

      await this.activityLogService.create({
        adminUuid: admin.userUuid,
        adminUserName: admin.username,
        action: ActivityAction.CREATE,
        entityType: EntityType.NOTIFICATION,
        entityTitle: notification.title_en,
        entityUuid: notification.uuid,
      });

      return {
        data: notification,
        message: 'Notification created successfully',
      };
    } catch (error) {
      await this.handleError(
        error,
        'POST',
        '/admin/notifications',
        dto,
        admin.userUuid,
      );
      throw new InternalServerErrorException('Failed to create notification');
    }
  }

  async update(
    uuid: string,
    dto: UpdateNotificationDto,
    admin: { userUuid: string; username: string },
  ) {
    try {
      if (dto.date && dto.expiresAt) {
        if (new Date(dto.expiresAt) <= new Date(dto.date)) {
          throw new BadRequestException(
            'Expiry date must be equal to or after publish date',
          );
        }
      }

      const updated = await this.notificationModel
        .findOneAndUpdate(
          { uuid },
          { $set: dto },
          { new: true, runValidators: true },
        )
        .exec();

      if (!updated) {
        throw new NotFoundException(`Notification with UUID ${uuid} not found`);
      }

      await this.activityLogService.create({
        adminUuid: admin.userUuid,
        adminUserName: admin.username,
        action: ActivityAction.UPDATE,
        entityType: EntityType.NOTIFICATION,
        entityTitle: updated.title_en,
        entityUuid: updated.uuid,
      });

      return {
        data: updated,
        message: 'Notification updated successfully',
      };
    } catch (error) {
      await this.handleError(
        error,
        'PATCH',
        `/admin/notifications/${uuid}`,
        dto,
        admin.userUuid,
      );

      if (error.getStatus && typeof error.getStatus === 'function') {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update notification');
    }
  }

  async remove(uuid: string, admin: { userUuid: string; username: string }) {
    try {
      const res = await this.notificationModel
        .findOneAndDelete({ uuid })
        .exec();

      if (!res) {
        throw new NotFoundException(`Notification with UUID ${uuid} not found`);
      }

      await this.activityLogService.create({
        adminUuid: admin.userUuid,
        adminUserName: admin.username,
        action: ActivityAction.DELETE,
        entityType: EntityType.NOTIFICATION,
        entityTitle: res.title_en,
        entityUuid: res.uuid,
      });

      return {
        data: { success: true },
        message: 'Notification removed successfully',
      };
    } catch (error) {
      await this.handleError(
        error,
        'DELETE',
        `/admin/notifications/${uuid}`,
        null,
        admin.userUuid,
      );

      if (error.getStatus && typeof error.getStatus === 'function') {
        throw error;
      }
      throw new InternalServerErrorException('Failed to remove notification');
    }
  }

  // ===== PUBLIC
  async findPublished(query?: { category?: string; showArchived?: boolean }) {
    try {
      const now = new Date();
      const filters: any = {
        status: NotificationStatus.PUBLISHED,
        date: { $lt: now },
      };

      if (query?.category && query.category !== 'ALL') {
        filters.category = query.category;
      }

      if (query?.showArchived) {
        filters.expiresAt = { $lt: now };
      } else {
        filters.expiresAt = { $gt: now };
      }

      return await this.notificationModel
        .find(filters)
        .select(
          'uuid title_en title_ml content_en content_ml date expiresAt category isPinned -_id',
        )
        .sort({ isPinned: -1, category: -1, date: -1 })
        .exec();
    } catch (error) {
      await this.handleError(
        error,
        'GET',
        '/public/notifications',
        query,
        'GUEST',
      );
      throw new InternalServerErrorException('Failed to fetch notifications');
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
