import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Magazine, MagazineDocument } from './schemas/magazine.schema';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';

@Injectable()
export class MagazineService {
  constructor(
    @InjectModel(Magazine.name)
    private magazineModel: Model<MagazineDocument>,
  ) {}

  // ADMIN
  findAllAdmin() {
    return this.magazineModel.find().sort({ year: -1, createdAt: -1 });
  }

  create(dto: CreateMagazineDto) {
    return this.magazineModel.create(dto);
  }

  async update(id: string, dto: UpdateMagazineDto) {
    const updated = await this.magazineModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException('Magazine not found');
    }

    return updated;
  }

  async remove(id: string) {
    const deleted = await this.magazineModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('Magazine not found');
    }
  }

  // PUBLIC
  findPublished() {
    return this.magazineModel.find({ status: 'PUBLISHED' }).sort({ year: -1 });
  }
}
