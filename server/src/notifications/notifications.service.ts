import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
  NotificationStatus,
  NotificationPriority,
} from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification-dto';
import { UpdateNotificationDto } from './dto/update-notification-dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import {
  ActivityAction,
  EntityType,
} from '../activity-log/schemas/activity-log.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private readonly activityLogService: ActivityLogService,
  ) {}

  // ===== ADMIN - Paginated with Filters and Search =====

  async findAllAdmin(query: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      search,
      startDate,
      endDate,
    } = query;
    const skip = (page - 1) * limit;

    const filters: any = {};

    // 1. Exact Match Filters
    if (status && status !== 'ALL') filters.status = status;
    if (priority && priority !== 'ALL') filters.priority = priority;

    // 2. Multi-field Text Search (Title or Content)
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      filters.$or = [{ title: searchRegex }, { content: searchRegex }];
    }

    // 3. Date Range Filter (Using the 'date' field from schema)
    if (startDate || endDate) {
      filters.date = {};
      if (startDate) {
        filters.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filters.date.$lte = end;
      }
    }

    const [data, totalItems] = await Promise.all([
      this.notificationModel
        .find(filters)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.notificationModel.countDocuments(filters).exec(),
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
    dto: CreateNotificationDto,
    admin: { userUuid: string; username: string },
  ) {
    const notification = await this.notificationModel.create(dto);

    await this.activityLogService.create({
      adminUuid: admin.userUuid,
      adminUserName: admin.username,
      action: ActivityAction.CREATE,
      entityType: EntityType.NOTIFICATION,
      entityTitle: notification.title,
      entityUuid: notification.uuid,
    });

    return {
      data: notification,
      message: 'Notification created successfully',
    };
  }

  async update(
    uuid: string,
    dto: UpdateNotificationDto,
    admin: { userUuid: string; username: string },
  ) {
    const updated = await this.notificationModel
      .findOneAndUpdate({ uuid }, { $set: dto }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Notification with UUID ${uuid} not found`);
    }

    await this.activityLogService.create({
      adminUuid: admin.userUuid,
      adminUserName: admin.username,
      action: ActivityAction.UPDATE,
      entityType: EntityType.NOTIFICATION,
      entityTitle: updated.title,
      entityUuid: updated.uuid,
    });

    return {
      data: updated,
      message: 'Notification updated successfully',
    };
  }

  async remove(uuid: string, admin: { userUuid: string; username: string }) {
    const res = await this.notificationModel.findOneAndDelete({ uuid }).exec();

    if (!res) {
      throw new NotFoundException(`Notification with UUID ${uuid} not found`);
    }

    await this.activityLogService.create({
      adminUuid: admin.userUuid,
      adminUserName: admin.username,
      action: ActivityAction.DELETE,
      entityType: EntityType.NOTIFICATION,
      entityTitle: res.title,
      entityUuid: res.uuid,
    });

    return {
      data: { success: true },
      message: 'Notification removed successfully',
    };
  }

  // ===== PUBLIC =====

  async findPublished() {
    return await this.notificationModel
      .find({ status: NotificationStatus.PUBLISHED })
      .select('uuid title content date priority -_id')
      .sort({ date: -1, createdAt: -1 })
      .exec();
  }
}
