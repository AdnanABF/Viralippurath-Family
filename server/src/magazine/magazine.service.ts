import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Magazine,
  MagazineDocument,
  MagazineStatus,
} from './schemas/magazine.schema';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

/**
 * Internal interface to allow adding Cloudinary fields
 * that are not present in the public-facing DTO.
 */
interface MagazineUpdatePayload extends UpdateMagazineDto {
  pdfUrl?: string;
  cloudinaryPublicId?: string;
}

@Injectable()
export class MagazineService {
  constructor(
    @InjectModel(Magazine.name)
    private magazineModel: Model<MagazineDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ===== PUBLIC METHODS =====

  async findPublished() {
    return await this.magazineModel
      .find({ status: MagazineStatus.PUBLISHED })
      .select('uuid title publishedDate pdfUrl -_id')
      .sort({ publishedDate: -1 })
      .exec();
  }

  // ===== ADMIN METHODS =====

  async findAllAdmin() {
    return await this.magazineModel
      .find()
      .sort({ publishedDate: -1, createdAt: -1 })
      .exec();
  }

  async create(dto: CreateMagazineDto, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Magazine PDF file is required');
    }

    // 1. Upload to Cloudinary (resource_type 'image' enables PDF transformations)
    const uploadResult = await this.cloudinaryService.uploadFile(
      file,
      'magazines',
      'image',
    );

    return await this.magazineModel.create({
      ...dto,
      pdfUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
    });
  }

  async update(
    uuid: string,
    dto: UpdateMagazineDto,
    file?: Express.Multer.File,
  ) {
    const magazine = await this.magazineModel.findOne({ uuid }).exec();
    if (!magazine) {
      throw new NotFoundException(`Magazine with UUID ${uuid} not found`);
    }

    const updateData: MagazineUpdatePayload = { ...dto };

    if (file) {
      if (magazine.cloudinaryPublicId) {
        await this.cloudinaryService.deleteFile(
          magazine.cloudinaryPublicId,
          'image',
        );
      }

      const uploadResult = await this.cloudinaryService.uploadFile(
        file,
        'magazines',
        'image',
      );

      updateData.pdfUrl = uploadResult.secure_url;
      updateData.cloudinaryPublicId = uploadResult.public_id;
    }

    const updated = await this.magazineModel
      .findOneAndUpdate({ uuid }, { $set: updateData }, { new: true })
      .exec();

    return updated;
  }

  async remove(uuid: string) {
    const magazine = await this.magazineModel.findOne({ uuid }).exec();
    if (!magazine) {
      throw new NotFoundException(`Magazine with UUID ${uuid} not found`);
    }

    if (magazine.cloudinaryPublicId) {
      await this.cloudinaryService.deleteFile(
        magazine.cloudinaryPublicId,
        'image',
      );
    }

    await this.magazineModel.findOneAndDelete({ uuid }).exec();

    return { deleted: true };
  }
}
