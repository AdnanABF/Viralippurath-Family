import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Admin, AdminDocument, AdminRole } from './admin.schema';
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
  private readonly creatorUuid: string;

  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<AdminDocument>,
    private configService: ConfigService,
    private readonly activityLogService: ActivityLogService,
    private readonly systemLogService: SystemLogService,
  ) {
    this.creatorUuid = this.configService.get<string>('SYSTEM_CREATOR_UUID')!;
  }

  async findByUsername(username: string, isActive: boolean = true) {
    return await this.adminModel.findOne({ username, isActive }).exec();
  }

  /**
   * Used by Guards to verify if a user is still active in real-time.
   */
  async validateUserActive(uuid: string): Promise<boolean> {
    const admin = await this.adminModel
      .findOne({ uuid })
      .select('isActive')
      .exec();
    return !!admin?.isActive;
  }

  async findByUuid(uuid: string): Promise<AdminDocument | null> {
    try {
      const admin = await this.adminModel.findOne({ uuid }).exec();
      if (!admin)
        throw new NotFoundException(`Admin with UUID ${uuid} not found`);
      return admin;
    } catch (error) {
      await this.handleError(error, 'GET', `/admin/${uuid}`, { uuid });
      if (error.getStatus && typeof error.getStatus === 'function') {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving admin profile');
    }
  }

  async findAll(query: {
    page: number;
    limit: number;
    role?: string;
    status?: string;
    search?: string;
    adminUserUuid?: string;
  }) {
    try {
      const { page, limit, role, status, search } = query;
      const skip = (page - 1) * limit;

      const filters: any = {};
      if (role && role !== 'ALL') {
        filters.role = role;
      }

      if (status && status !== 'ALL') {
        filters.isActive = status == 'ACTIVE' ? true : false;
      }

      if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        filters.$or = [{ username: searchRegex }, { fullName: searchRegex }];
      }

      const [admins, totalItems] = await Promise.all([
        this.adminModel
          .find(filters)
          .select('-passwordHash -refreshTokenHash')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .select('username fullName role isActive uuid lastLogin -_id')
          .exec(),
        this.adminModel.countDocuments(filters),
      ]);

      const data = admins.map((admin) => ({
        ...admin.toObject(),
        isCreator: admin.uuid === this.creatorUuid,
      }));

      return {
        data,
        meta: {
          totalItems,
          itemCount: data.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: Number(page),
        },
      };
    } catch (error) {
      await this.handleError(
        error,
        'GET',
        '/admin',
        query,
        query.adminUserUuid,
      );
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

      if (error.getStatus && typeof error.getStatus === 'function') {
        throw error;
      }

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
      if (uuid === this.creatorUuid && admin.userUuid != this.creatorUuid) {
        throw new ForbiddenException(
          'Access Denied: The System Creator account can only be modified by itself.',
        );
      }

      if (uuid === admin.userUuid) {
        if (updateData.isActive === false) {
          throw new BadRequestException(
            'Security Constraint: You cannot deactivate your own account. Contact another Super Admin if needed.',
          );
        }

        if (updateData.role && updateData.role !== AdminRole.SUPER_ADMIN) {
          throw new BadRequestException(
            'Security Constraint: You cannot change your own role. Another Super Admin must perform this action.',
          );
        }
      }

      if (updateData.username) {
        const userExists = await this.findByUsername(
          updateData.username,
          false,
        );
        if (userExists && userExists.uuid != uuid) {
          throw new ConflictException('username is already in use');
        }
      }

      // Force session invalidation if account is deactivated
      if (updateData.isActive === false) {
        updateData.refreshTokenHash = null;
        updateData.refreshTokenExpiresAt = null;
      }

      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.passwordHash = await bcrypt.hash(updateData.password, salt);
        // Invalidate sessions on password change
        updateData.refreshTokenHash = null;
        updateData.refreshTokenExpiresAt = null;
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

      if (error.getStatus && typeof error.getStatus === 'function') {
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
      if (uuid === this.creatorUuid) {
        throw new ForbiddenException(
          'Security Constraint: The System Creator account is immutable and cannot be deleted.',
        );
      }

      if (uuid === admin.userUuid) {
        throw new BadRequestException(
          'Self-deletion is not permitted. You cannot remove your own account.',
        );
      }

      const adminToDelete = await this.adminModel.findOne({ uuid });
      if (!adminToDelete) throw new NotFoundException(`Admin not found`);

      if (adminToDelete.role === AdminRole.SUPER_ADMIN) {
        const superAdminCount = await this.adminModel.countDocuments({
          role: AdminRole.SUPER_ADMIN,
          isActive: true,
        });

        if (superAdminCount <= 1) {
          throw new BadRequestException(
            'Security Constraint: Cannot delete the last remaining Super Admin. Promote another user first.',
          );
        }
      }

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

      if (error.getStatus && typeof error.getStatus === 'function') {
        throw error;
      }

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

  async clearRefreshToken(uuid: string): Promise<void> {
    try {
      await this.adminModel
        .updateOne(
          { uuid },
          {
            $set: {
              refreshTokenHash: null,
              refreshTokenExpiresAt: null,
            },
          },
        )
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to clear refresh token for user ${uuid}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to invalidate session');
    }
  }

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
