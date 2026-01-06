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
import { ActivityLogService } from '../activity-log/activity-log.service';
import {
  ActivityAction,
  EntityType,
} from '../activity-log/schemas/activity-log.schema';

@Injectable()
export class MagazineService {
  private readonly logger = new Logger(MagazineService.name);

  constructor(
    @InjectModel(Magazine.name)
    private magazineModel: Model<MagazineDocument>,
    private cloudinaryService: CloudinaryService,
    private readonly activityLogService: ActivityLogService,
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

  async create(
    dto: CreateMagazineDto,
    admin: { userUuid: string; username: string },
  ) {
    const magazine = await this.magazineModel.create(dto);

    await this.activityLogService.create({
      adminUuid: admin.userUuid,
      adminUserName: admin.username,
      action: ActivityAction.CREATE,
      entityType: EntityType.MAGAZINE,
      entityTitle: magazine.title,
      entityUuid: magazine.uuid,
    });

    return magazine;
  }

  async update(
    uuid: string,
    dto: UpdateMagazineDto,
    admin: { userUuid: string; username: string },
  ) {
    const magazine = await this.magazineModel.findOne({ uuid }).exec();
    if (!magazine) {
      throw new NotFoundException(`Magazine with UUID ${uuid} not found`);
    }

    if (
      dto.cloudinaryPublicId &&
      magazine.cloudinaryPublicId !== dto.cloudinaryPublicId
    ) {
      if (magazine.cloudinaryPublicId) {
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

    if (updated) {
      await this.activityLogService.create({
        adminUuid: admin.userUuid,
        adminUserName: admin.username,
        action: ActivityAction.UPDATE,
        entityType: EntityType.MAGAZINE,
        entityTitle: updated.title,
        entityUuid: updated.uuid,
      });
    }
    return updated;
  }

  async remove(uuid: string, admin: { userUuid: string; username: string }) {
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

    await this.activityLogService.create({
      adminUuid: admin.userUuid,
      adminUserName: admin.username,
      action: ActivityAction.DELETE,
      entityType: EntityType.MAGAZINE,
      entityTitle: magazine.title,
      entityUuid: magazine.uuid,
    });

    return { deleted: true };
  }
}
