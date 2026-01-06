import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ActivityLog,
  ActivityLogDocument,
} from './schemas/activity-log.schema';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectModel(ActivityLog.name)
    private activityLogModel: Model<ActivityLogDocument>,
  ) {}

  /**
   * Creates a new activity log entry.
   * This will be called by other services (Events, Magazines, etc.)
   */
  async create(
    createActivityLogDto: CreateActivityLogDto,
  ): Promise<ActivityLog> {
    const newLog = new this.activityLogModel(createActivityLogDto);
    return newLog.save();
  }

  /**
   * Fetches all activities.
   */
  async getAllActivities(): Promise<ActivityLog[]> {
    return this.activityLogModel
      .find()
      .sort({ createdAt: -1 })
      .select('uuid adminUserName action entityType entityTitle createdAt -_id')
      .exec();
  }

  /**
   * Fetches recent activities for the admin dashboard.
   * @param limit Number of recent activities to fetch (default 10)
   */
  async getRecentActivities(limit: number = 10): Promise<ActivityLog[]> {
    return this.activityLogModel
      .find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(limit)
      .select('uuid adminUserName action entityType entityTitle createdAt -_id')
      .exec();
  }

  /**
   * Optional: Get activity count for a specific entity type
   */
  async getCountByType(type: string): Promise<number> {
    return this.activityLogModel.countDocuments({ entityType: type }).exec();
  }
}
