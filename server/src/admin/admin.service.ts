import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'; // Added BadRequestException
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './admin.schema';
import * as bcrypt from 'bcrypt';
import { ActivityLogService } from '../activity-log/activity-log.service';
import {
  ActivityAction,
  EntityType,
} from '../activity-log/schemas/activity-log.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<AdminDocument>,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async findByUsername(username: string) {
    return await this.adminModel.findOne({ username, isActive: true }).exec();
  }

  async findByUuid(uuid: string): Promise<AdminDocument | null> {
    const admin = await this.adminModel.findOne({ uuid }).exec();
    if (!admin)
      throw new NotFoundException(`Admin with UUID ${uuid} not found`);
    return admin;
  }

  async findAll() {
    return this.adminModel
      .find()
      .select('-passwordHash -refreshTokenHash')
      .sort({ createdAt: -1 })
      .lean() // Use lean for faster, read-only performance
      .exec();
  }

  async createAdmin(
    data: Partial<Admin> & { password?: string },
    admin: { userUuid: string; username: string },
  ) {
    const { password, ...rest } = data;

    if (!password) {
      // Switched to BadRequestException (Standard NestJS)
      throw new BadRequestException('Password is required to create an admin');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = new this.adminModel({
      ...rest,
      passwordHash,
    });

    const saved = await newAdmin.save();

    // Activity Log
    await this.activityLogService.create({
      adminUuid: admin.userUuid,
      adminUserName: admin.username,
      action: ActivityAction.CREATE,
      entityType: EntityType.ADMIN,
      entityTitle: saved.username,
      entityUuid: saved.uuid,
    });

    // Convert to object and remove passwordHash before returning
    const result = saved.toObject() as any;
    delete result.passwordHash;
    delete result.refreshTokenHash;
    return result;
  }

  async updateAdmin(
    uuid: string,
    updateData: any,
    admin: { userUuid: string; username: string },
  ) {
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(updateData.password, salt);
      delete updateData.password;
    }

    const updated = await this.adminModel
      .findOneAndUpdate({ uuid }, updateData, { new: true })
      .select('-passwordHash -refreshTokenHash')
      .lean()
      .exec();

    if (!updated) throw new NotFoundException('Admin not found');

    await this.activityLogService.create({
      adminUuid: admin.userUuid,
      adminUserName: admin.username,
      action: ActivityAction.UPDATE,
      entityType: EntityType.ADMIN,
      entityTitle: updated.username,
      entityUuid: updated.uuid,
    });

    return updated;
  }

  async removeAdmin(
    uuid: string,
    admin: { userUuid: string; username: string },
  ) {
    const deletedAdmin = await this.adminModel
      .findOneAndDelete({ uuid })
      .exec();

    if (!deletedAdmin)
      throw new NotFoundException(`Admin with UUID ${uuid} not found`);

    await this.activityLogService.create({
      adminUuid: admin.userUuid,
      adminUserName: admin.username,
      action: ActivityAction.DELETE,
      entityType: EntityType.ADMIN,
      entityTitle: deletedAdmin.username,
      entityUuid: deletedAdmin.uuid,
    });

    return { success: true };
  }

  async findByRefreshTokenHash() {
    return this.adminModel
      .findOne({
        refreshTokenHash: { $exists: true },
        isActive: true,
      })
      .exec();
  }
}
