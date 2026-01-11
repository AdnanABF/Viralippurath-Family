import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
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
import { SystemLogService } from '../system-log/system-log.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Gallery.name) private galleryModel: Model<GalleryDocument>,
    @InjectModel(Magazine.name) private magazineModel: Model<MagazineDocument>,
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private readonly systemLogService: SystemLogService,
  ) {}

  /**
   * Aggregates summary statistics across all major modules.
   * Return structure is designed for quick-glance dashboard widgets.
   */
  async getSummaryStats(adminUserUuid?: string) {
    try {
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
    } catch (error) {
      await this.handleError(
        error,
        'GET',
        '/admin/dashboard/stats',
        null,
        adminUserUuid,
      );
      throw new InternalServerErrorException(
        'Failed to load dashboard statistics',
      );
    }
  }

  /**
   * Helper method to record system logs for Dashboard operations
   */
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
