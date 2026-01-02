import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument, NotificationStatus } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification-dto';
import { UpdateNotificationDto } from './dto/update-notification-dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  // ADMIN
  findAllAdmin() {
    return this.notificationModel.find().sort({ date: -1 });
  }

  create(dto: CreateNotificationDto) {
    return this.notificationModel.create(dto);
  }

  update(id: string, dto: UpdateNotificationDto) {
    return this.notificationModel.findByIdAndUpdate(id, dto, { new: true });
  }

  remove(id: string) {
    return this.notificationModel.findByIdAndDelete(id);
  }

  // PUBLIC
  findPublished() {
    return this.notificationModel.find({ status: 'PUBLISHED' }).sort({ year: -1 });
  }
}
