import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ActivityLog,
  ActivityLogDocument,
  ActivityAction,
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
   */
  async create(
    createActivityLogDto: CreateActivityLogDto,
  ): Promise<ActivityLog> {
    const newLog = new this.activityLogModel(createActivityLogDto);
    return newLog.save();
  }

  /**
   * Fetches paginated activities with metadata and multi-filter support.
   */
  async getPaginatedActivities(query: {
    page?: number;
    limit?: number;
    entityType?: string;
    action?: ActivityAction;
    startDate?: string;
    endDate?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      entityType,
      action,
      startDate,
      endDate,
    } = query;
    const skip = (page - 1) * limit;

    const filters: any = {};

    if (entityType && entityType !== 'ALL') {
      filters.entityType = entityType;
    }

    if (action && action.toString() !== 'ALL') {
      filters.action = action;
    }

    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) {
        filters.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filters.createdAt.$lte = end;
      }
    }

    const [data, totalItems] = await Promise.all([
      this.activityLogModel
        .find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          'uuid adminUserName action entityType entityTitle createdAt -_id',
        )
        .exec(),
      this.activityLogModel.countDocuments(filters).exec(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      meta: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: Number(page),
      },
    };
  }

  /**
   * Fetches recent activities for the admin dashboard.
   */
  async getRecentActivities(limit: number = 10): Promise<ActivityLog[]> {
    return this.activityLogModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('uuid adminUserName action entityType entityTitle createdAt -_id')
      .exec();
  }

  /**
   * Get activity count for a specific entity type
   */
  async getCountByType(type: string): Promise<number> {
    return this.activityLogModel.countDocuments({ entityType: type }).exec();
  }
}
