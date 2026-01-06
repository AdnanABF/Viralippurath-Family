import { Injectable, NotFoundException } from '@nestjs/common';
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

  // ===== ADMIN =====

  async findAllAdmin() {
    return await this.notificationModel.find().sort({ createdAt: -1 }).exec();
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

    return notification;
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

    return updated;
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

    return { deleted: true };
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
