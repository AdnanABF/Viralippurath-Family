import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Gallery, GallerySchema } from './schemas/gallery.schema';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gallery.name, schema: GallerySchema }]),
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
