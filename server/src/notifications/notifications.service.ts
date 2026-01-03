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

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  // ===== ADMIN =====

  async findAllAdmin() {
    return await this.notificationModel.find().sort({ createdAt: -1 }).exec();
  }

  async create(dto: CreateNotificationDto) {
    return await this.notificationModel.create(dto);
  }

  async update(uuid: string, dto: UpdateNotificationDto) {
    const updated = await this.notificationModel
      .findOneAndUpdate({ uuid }, { $set: dto }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Notification with UUID ${uuid} not found`);
    }

    return updated;
  }

  async remove(uuid: string) {
    const res = await this.notificationModel.findOneAndDelete({ uuid }).exec();

    if (!res) {
      throw new NotFoundException(`Notification with UUID ${uuid} not found`);
    }

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
