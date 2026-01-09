import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './admin.schema';
import * as bcrypt from 'bcrypt';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { SystemLogService } from '../system-log/system-log.service';
import {
  ActivityAction,
  EntityType,
} from '../activity-log/schemas/activity-log.schema';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<AdminDocument>,
    private readonly activityLogService: ActivityLogService,
    private readonly systemLogService: SystemLogService,
  ) {}

  async findByUsername(username: string, isActive: boolean = true) {
    return await this.adminModel.findOne({ username, isActive }).exec();
  }

  async findByUuid(uuid: string): Promise<AdminDocument | null> {
    try {
      const admin = await this.adminModel.findOne({ uuid }).exec();
      if (!admin)
        throw new NotFoundException(`Admin with UUID ${uuid} not found`);
      return admin;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      await this.handleError(error, 'GET', `/admin/${uuid}`, { uuid });
      throw new InternalServerErrorException('Error retrieving admin profile');
    }
  }

  async findAll() {
    try {
      return await this.adminModel
        .find()
        .select('-passwordHash -refreshTokenHash')
        .sort({ createdAt: -1 })
        .lean()
        .exec();
    } catch (error) {
      await this.handleError(error, 'GET', '/admin', null);
      throw new InternalServerErrorException('Failed to fetch admin list');
    }
  }

  async createAdmin(
    data: Partial<Admin> & { password?: string },
    admin: { userUuid: string; username: string },
  ) {
    try {
      const { password, ...rest } = data;

      if (rest.username) {
        const userExists = await this.findByUsername(rest.username, false);
        if (userExists) {
          throw new ConflictException('username is already in use');
        }
      }

      if (!password) {
        throw new BadRequestException(
          'Password is required to create an admin',
        );
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newAdmin = new this.adminModel({
        ...rest,
        passwordHash,
      });

      const saved = await newAdmin.save();

      await this.activityLogService.create({
        adminUuid: admin.userUuid,
        adminUserName: admin.username,
        action: ActivityAction.CREATE,
        entityType: EntityType.ADMIN,
        entityTitle: saved.username,
        entityUuid: saved.uuid,
      });

      const result = saved.toObject() as any;
      delete result.passwordHash;
      delete result.refreshTokenHash;

      return {
        data: result,
        message: 'Admin account created successfully',
      };
    } catch (error) {
      await this.handleError(
        error,
        'POST',
        '/admin',
        { ...data, password: '***' },
        admin.userUuid,
      );

      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      // Capture duplicate key error even if findByUsername missed it (race conditions)
      if (error.code === 11000) {
        throw new ConflictException('Username or email already exists');
      }

      throw new InternalServerErrorException('Failed to create admin account');
    }
  }

  async updateAdmin(
    uuid: string,
    updateData: any,
    admin: { userUuid: string; username: string },
  ) {
    try {
      if (updateData.username) {
        const userExists = await this.findByUsername(
          updateData.username,
          false,
        );
        if (userExists && userExists.uuid != uuid) {
          throw new ConflictException('username is already in use');
        }
      }

      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.passwordHash = await bcrypt.hash(updateData.password, salt);
        delete updateData.password;
      }

      const updated = await this.adminModel
        .findOneAndUpdate({ uuid }, updateData, {
          new: true,
          runValidators: true,
        })
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

      return {
        data: updated,
        message: 'Admin profile updated successfully',
      };
    } catch (error) {
      await this.handleError(
        error,
        'PATCH',
        `/admin/${uuid}`,
        { ...updateData, password: '***' },
        admin.userUuid,
      );

      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update admin profile');
    }
  }

  async removeAdmin(
    uuid: string,
    admin: { userUuid: string; username: string },
  ) {
    try {
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

      return {
        data: { success: true },
        message: 'Admin account removed successfully',
      };
    } catch (error) {
      await this.handleError(
        error,
        'DELETE',
        `/admin/${uuid}`,
        null,
        admin.userUuid,
      );

      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to remove admin account');
    }
  }

  async findByRefreshTokenHash() {
    return this.adminModel
      .findOne({
        refreshTokenHash: { $exists: true },
        isActive: true,
      })
      .exec();
  }

  /**
   * Helper method to record system logs for Admin operations
   */
  private async handleError(
    error: any,
    method: string,
    path: string,
    payload: any,
    userUuid?: string,
  ) {
    this.logger.error(
      `${method} ${path} failed: ${error.message}`,
      error.stack,
    );

    await this.systemLogService.log({
      errorCode: error.code?.toString() || error.name || '500',
      message: error.message,
      stack: error.stack,
      path,
      method,
      payload,
      userUuid: userUuid || 'SYSTEM',
    });
  }
}
