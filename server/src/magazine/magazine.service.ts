import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class MagazineService {
  private readonly logger = new Logger(MagazineService.name);

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

  async create(dto: CreateMagazineDto) {
    return await this.magazineModel.create(dto);
  }

  async update(uuid: string, dto: UpdateMagazineDto) {
    const magazine = await this.magazineModel.findOne({ uuid }).exec();
    if (!magazine) {
      throw new NotFoundException(`Magazine with UUID ${uuid} not found`);
    }

    // Logic to clean up Cloudinary if the file is being replaced
    if (
      dto.cloudinaryPublicId &&
      magazine.cloudinaryPublicId !== dto.cloudinaryPublicId
    ) {
      if (magazine.cloudinaryPublicId) {
        // We don't await this to avoid slowing down the response,
        // or await if you want to ensure it's gone.
        this.cloudinaryService
          .deleteFile(magazine.cloudinaryPublicId, 'image')
          .catch((err) =>
            this.logger.error(
              `Failed to delete old Cloudinary file: ${magazine.cloudinaryPublicId}`,
              err,
            ),
          );
      }
    }

    const updated = await this.magazineModel
      .findOneAndUpdate({ uuid }, { $set: dto }, { new: true })
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
