import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Event, EventSchema } from '../events/schemas/event.schema';
import { Gallery, GallerySchema } from '../gallery/schemas/gallery.schema';
import { Magazine, MagazineSchema } from '../magazine/schemas/magazine.schema';
import {
  Notification,
  NotificationSchema,
} from '../notifications/schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Gallery.name, schema: GallerySchema },
      { name: Magazine.name, schema: MagazineSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
