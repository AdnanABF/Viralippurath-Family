import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Gallery,
  GalleryDocument,
  GalleryStatus,
} from './schemas/gallery.schema';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Gallery.name)
    private galleryModel: Model<GalleryDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ===== ADMIN METHODS =====

  async findAllAdmin() {
    return await this.galleryModel.find().sort({ createdAt: -1 }).exec();
  }

  async create(dto: CreateGalleryDto, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'Image file is required for gallery creation',
      );
    }

    // 1. Upload file to Cloudinary
    const cloudResponse = await this.cloudinaryService.uploadFile(
      file,
      'gallery',
    );

    // 2. Create database record with Cloudinary URL and PublicID
    const newGallery = new this.galleryModel({
      ...dto,
      imageUrl: cloudResponse.secure_url,
      publicId: cloudResponse.public_id,
    });

    return await newGallery.save();
  }

  async update(
    uuid: string,
    dto: UpdateGalleryDto,
    file?: Express.Multer.File,
  ) {
    // 1. Check if record exists
    const existing = await this.galleryModel.findOne({ uuid }).exec();
    if (!existing) {
      throw new NotFoundException(`Gallery image with UUID ${uuid} not found`);
    }

    let updateData = { ...dto } as any;

    // 2. Handle File Swap if a new file is provided
    if (file) {
      // Delete old file from Cloudinary to save space
      if (existing.publicId) {
        await this.cloudinaryService.deleteFile(existing.publicId);
      }

      // Upload new file
      const cloudResponse = await this.cloudinaryService.uploadFile(file);
      updateData.imageUrl = cloudResponse.secure_url;
      updateData.publicId = cloudResponse.public_id;
    }

    // 3. Update the document
    const updated = await this.galleryModel
      .findOneAndUpdate({ uuid }, { $set: updateData }, { new: true })
      .exec();

    return updated;
  }

  async remove(uuid: string) {
    // 1. Find record to get publicId
    const existing = await this.galleryModel.findOne({ uuid }).exec();
    if (!existing) {
      throw new NotFoundException(`Gallery image with UUID ${uuid} not found`);
    }

    // 2. Remove file from Cloudinary
    if (existing.publicId) {
      await this.cloudinaryService.deleteFile(existing.publicId);
    }

    // 3. Delete from Database
    await this.galleryModel.findOneAndDelete({ uuid }).exec();

    return { deleted: true };
  }

  // ===== PUBLIC METHODS =====

  async findPublished() {
    // Note: ensure 'publicId' is not selected for public API to keep internal IDs private
    return await this.galleryModel
      .find({ status: GalleryStatus.PUBLISHED })
      .select('uuid imageUrl caption album year -_id')
      .sort({ year: -1, createdAt: -1 })
      .exec();
  }
}
