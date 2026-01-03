import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Gallery,
  GalleryDocument,
  GalleryStatus,
} from './schemas/gallery.schema';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Gallery.name)
    private galleryModel: Model<GalleryDocument>,
  ) {}

  // Admin
  async findAllAdmin() {
    return await this.galleryModel.find().sort({ createdAt: -1 }).exec();
  }

  async create(dto: CreateGalleryDto) {
    return await this.galleryModel.create(dto);
  }

  async update(uuid: string, dto: UpdateGalleryDto) {
    const updated = await this.galleryModel
      .findOneAndUpdate({ uuid }, { $set: dto }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Gallery image with UUID ${uuid} not found`);
    }

    return updated;
  }

  async remove(uuid: string) {
    const res = await this.galleryModel.findOneAndDelete({ uuid }).exec();

    if (!res) {
      throw new NotFoundException(`Gallery image with UUID ${uuid} not found`);
    }

    return { deleted: true };
  }

  // ===== PUBLIC =====

  async findPublished() {
    return await this.galleryModel
      .find({ status: GalleryStatus.PUBLISHED })
      .select('uuid imageUrl caption album year -_id')
      .sort({ year: -1, createdAt: -1 })
      .exec();
  }
}
