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

      // Updated: Trust the ISO strings provided by the frontend
      if (startDate || endDate) {
        filters.date = {};
        if (startDate) filters.date.$gte = new Date(startDate);
        if (endDate) filters.date.$lte = new Date(endDate);
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

  async getLatestThree() {
    try {
      const now = new Date();
      return await this.notificationModel
        .find({
          status: NotificationStatus.PUBLISHED,
          date: { $lte: now },
          expiresAt: { $gt: now },
        })
        .select(
          'uuid title_en title_ml content_en content_ml date category isPinned -_id',
        )
        .sort({ isPinned: -1, category: -1, date: -1 })
        .limit(3)
        .exec();
    } catch (error) {
      await this.handleError(
        error,
        'GET',
        '/public/notifications/latest',
        null,
        'GUEST',
      );
      throw new InternalServerErrorException(
        'Failed to fetch home notifications',
      );
    }
  }

  async findPublished(query: {
    category?: string;
    showArchived?: boolean;
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        category = 'ALL',
        showArchived = false,
        page = 1,
        limit = 10,
      } = query;
      const now = new Date();
      const skip = (page - 1) * limit;

      // 1. Base view filter (Upcoming vs Archive)
      const viewFilter: any = {
        status: NotificationStatus.PUBLISHED,
        date: { $lte: now },
      };

      if (showArchived) {
        viewFilter.expiresAt = { $lte: now };
      } else {
        viewFilter.expiresAt = { $gt: now };
      }

      // 2. Data filter (includes specific category)
      const dataFilter = { ...viewFilter };
      if (category && category !== 'ALL') {
        dataFilter.category = category;
      }

      // 3. Facet Aggregation
      const result = await this.notificationModel
        .aggregate([
          {
            $facet: {
              // Lane 1: Paginated Content
              data: [
                { $match: dataFilter },
                { $sort: { isPinned: -1, date: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                  $project: {
                    _id: 0,
                    uuid: 1,
                    title_en: 1,
                    title_ml: 1,
                    content_en: 1,
                    content_ml: 1,
                    date: 1,
                    expiresAt: 1,
                    category: 1,
                    isPinned: 1,
                  },
                },
              ],
              // Lane 2: Total count for pagination
              totalCount: [{ $match: dataFilter }, { $count: 'count' }],
              // Lane 3: Counts per category for pills
              categoryCounts: [
                { $match: viewFilter },
                { $group: { _id: '$category', count: { $sum: 1 } } },
              ],
            },
          },
        ])
        .exec();

      const totalItems = result[0].totalCount[0]?.count || 0;
      const rawCategoryCounts = result[0].categoryCounts || [];

      const formattedCategoryCounts = rawCategoryCounts.reduce((acc, curr) => {
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
          categoryCounts: formattedCategoryCounts,
          totalInView: Object.values(formattedCategoryCounts).reduce(
            (a: number, b: number) => a + b,
            0,
          ) as number,
        },
      };
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
