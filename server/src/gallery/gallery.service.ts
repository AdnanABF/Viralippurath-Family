import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gallery, GalleryDocument } from './schemas/gallery.schema';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Gallery.name)
    private galleryModel: Model<GalleryDocument>,
  ) {}

  // Admin
  findAllAdmin() {
    return this.galleryModel.find().sort({ createdAt: -1 });
  }

  create(dto: CreateGalleryDto) {
    return this.galleryModel.create(dto);
  }

  async update(id: string, dto: UpdateGalleryDto) {
    const updated = await this.galleryModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException('Gallery item not found');
    }

    return updated;
  }

  async remove(id: string) {
    const res = await this.galleryModel.findByIdAndDelete(id);
    if (!res) {
      throw new NotFoundException('Gallery item not found');
    }
  }

  // Public
  findPublished() {
    return this.galleryModel
      .find({ status: 'PUBLISHED' })
      .sort({ year: -1, createdAt: -1 });
  }
}
