import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ActivityLog,
  ActivityLogDocument,
  ActivityAction,
} from './schemas/activity-log.schema';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { SystemLogService } from '../system-log/system-log.service';
import { getCorrelationId } from '../common/correlation/correlation.storage';

@Injectable()
export class ActivityLogService {
  private readonly logger = new Logger(ActivityLogService.name);

  constructor(
    @InjectModel(ActivityLog.name)
    private activityLogModel: Model<ActivityLogDocument>,
    private readonly systemLogService: SystemLogService,
  ) {}

  /**
   * Creates a new activity log entry.
   */
  async create(createActivityLogDto: CreateActivityLogDto) {
    try {
      const correlationId = getCorrelationId(); // Get ID from storage

      const newLog = new this.activityLogModel({
        ...createActivityLogDto,
        correlationId, // Attach it to the activity log
      });

      return await newLog.save();
    } catch (error) {
      await this.handleError(
        error,
        'POST',
        'INTERNAL_SERVICE_LOG',
        createActivityLogDto,
      );
    }
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
    correlationId?: string;
    adminUserUuid?: string;
  }) {
    try {
      const {
        page = 1,
        limit = 10,
        entityType,
        action,
        startDate,
        endDate,
        correlationId,
      } = query;
      const skip = (page - 1) * limit;

      const filters: any = {};
      if (entityType && entityType !== 'ALL') filters.entityType = entityType;
      if (action && action.toString() !== 'ALL') filters.action = action;
      
      if (correlationId) {
        filters.correlationId = { $regex: correlationId, $options: 'i' };
      }

      if (startDate || endDate) {
        filters.createdAt = {};
        if (startDate) filters.createdAt.$gte = new Date(startDate);
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
            'uuid adminUserName action entityType entityTitle correlationId createdAt -_id',
          )
          .exec(),
        this.activityLogModel.countDocuments(filters).exec(),
      ]);

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
        '/admin/activity-logs',
        query,
        query.adminUserUuid,
      );
      throw new InternalServerErrorException('Failed to fetch activity logs');
    }
  }

  /**
   * Fetches recent activities for the admin dashboard.
   */
  async getRecentActivities(
    limit: number = 10,
    adminUserUuid?: string,
  ): Promise<ActivityLog[]> {
    try {
      return await this.activityLogModel
        .find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select(
          'uuid adminUserName action entityType entityTitle correlationId createdAt -_id',
        )
        .exec();
    } catch (error) {
      await this.handleError(
        error,
        'GET',
        '/admin/dashboard/recent-activity',
        { limit },
        adminUserUuid,
      );
      return [];
    }
  }

  /**
   * Get activity count for a specific entity type
   */
  async getCountByType(type: string): Promise<number> {
    try {
      return await this.activityLogModel
        .countDocuments({ entityType: type })
        .exec();
    } catch (error) {
      await this.handleError(error, 'GET', `INTERNAL_COUNT_${type}`, { type });
      return 0;
    }
  }

  /**
   * Helper method to record system logs for Activity Log failures
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
      errorCode: error.code?.toString() || error.name || 'LOGGING_ERROR',
      message: error.message,
      stack: error.stack,
      path,
      method,
      payload,
      userUuid: userUuid || 'SYSTEM_LOGGER',
    });
  }
}
