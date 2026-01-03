import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Magazine,
  MagazineDocument,
  MagazineStatus,
} from './schemas/magazine.schema';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';

@Injectable()
export class MagazineService {
  constructor(
    @InjectModel(Magazine.name)
    private magazineModel: Model<MagazineDocument>,
  ) {}

  // ===== PUBLIC =====

  async findPublished() {
    return await this.magazineModel
      .find({ status: MagazineStatus.PUBLISHED })
      .select(
        'uuid title publishedDate coverImageUrl flipbookUrl downloadUrl -_id',
      )
      .sort({ publishedDate: -1 })
      .exec();
  }

  // ===== ADMIN =====

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
    const updated = await this.magazineModel
      .findOneAndUpdate({ uuid }, { $set: dto }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Magazine with UUID ${uuid} not found`);
    }

    return updated;
  }

  async remove(uuid: string) {
    const res = await this.magazineModel.findOneAndDelete({ uuid }).exec();

    if (!res) {
      throw new NotFoundException(`Magazine with UUID ${uuid} not found`);
    }

    return { deleted: true };
  }
}
