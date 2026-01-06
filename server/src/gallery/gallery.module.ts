import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Gallery, GallerySchema } from './schemas/gallery.schema';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gallery.name, schema: GallerySchema }]),
    CloudinaryModule,
    ActivityLogModule,
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
