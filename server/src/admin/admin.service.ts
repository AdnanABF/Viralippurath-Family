import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './admin.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<AdminDocument>,
  ) {}

  findByUsername(username: string) {
    return this.adminModel.findOne({ username, isActive: true });
  }

  create(data: Partial<Admin>) {
    return this.adminModel.create(data);
  }

  async findByRefreshTokenHash() {
    return this.adminModel.findOne({
      refreshTokenHash: { $exists: true },
      isActive: true,
    });
  }
}
