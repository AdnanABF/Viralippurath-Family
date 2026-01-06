import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Event,
  EventDocument,
  EventStatus,
} from '../events/schemas/event.schema';
import {
  Gallery,
  GalleryDocument,
  GalleryStatus,
} from '../gallery/schemas/gallery.schema';
import {
  Magazine,
  MagazineDocument,
  MagazineStatus,
} from '../magazine/schemas/magazine.schema';
import {
  Notification,
  NotificationDocument,
  NotificationStatus,
} from '../notifications/schemas/notification.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Gallery.name) private galleryModel: Model<GalleryDocument>,
    @InjectModel(Magazine.name) private magazineModel: Model<MagazineDocument>,
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async getSummaryStats() {
    const now = new Date();

    const [upcomingEvents, totalImages, totalMagazines, activeAlerts] =
      await Promise.all([
        this.eventModel.countDocuments({
          status: EventStatus.PUBLISHED,
          endDateTime: { $gte: now },
        }),

        this.galleryModel.countDocuments({
          status: GalleryStatus.PUBLISHED,
        }),

        this.magazineModel.countDocuments({
          status: MagazineStatus.PUBLISHED,
        }),

        this.notificationModel.countDocuments({
          status: NotificationStatus.PUBLISHED,
        }),
      ]);

    return {
      upcomingEvents,
      galleryPhotos: totalImages,
      totalMagazines,
      activeAlerts,
    };
  }
}
