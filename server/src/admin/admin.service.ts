import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './admin.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<AdminDocument>,
  ) {}

  async findByUsername(username: string) {
    return await this.adminModel.findOne({ username, isActive: true });
  }

  async findByUuid(uuid: string): Promise<AdminDocument | null> {
    const admin = await this.adminModel.findOne({ uuid });
    if (!admin)
      throw new NotFoundException(`Admin with UUID ${uuid} not found`);
    return admin;
  }

  async findAll() {
    return this.adminModel
      .find()
      .select('-passwordHash -refreshTokenHash')
      .sort({ createdAt: -1 })
      .exec();
  }

  async createAdmin(data: Partial<Admin> & { password?: string }) {
    const { password, ...rest } = data;

    if (!password) {
      throw new Error('Password is required to create an admin');
    }

    // Hash the manual password provided by the Super Admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = new this.adminModel({
      ...rest,
      passwordHash,
    });

    const saved = await newAdmin.save();

    // Convert to object and remove passwordHash before returning
    const result = saved.toObject() as any;
    delete result.passwordHash;
    delete result.refreshTokenHash;
    return result;
  }

  async updateAdmin(uuid: string, updateData: any) {
    // If a new password is being set, hash it before saving
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(updateData.password, salt);
      delete updateData.password;
    }

    const updated = await this.adminModel
      .findOneAndUpdate({ uuid }, updateData, { new: true })
      .select('-passwordHash -refreshTokenHash')
      .lean();

    if (!updated) throw new NotFoundException('Admin not found');
    return updated;
  }

  async removeAdmin(uuid: string) {
    const result = await this.adminModel.deleteOne({ uuid });
    if (result.deletedCount === 0)
      throw new NotFoundException('Admin not found');
    return { success: true };
  }

  async findByRefreshTokenHash() {
    return this.adminModel.findOne({
      refreshTokenHash: { $exists: true },
      isActive: true,
    });
  }
}
