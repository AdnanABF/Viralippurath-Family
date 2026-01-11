import {
  ForbiddenException,
  Injectable,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SystemLog, SystemLogDocument } from './schemas/system-log.schema';
import { CreateSystemLogDto } from './dto/create-system-log.dto';
import { getCorrelationId } from '../common/correlation/correlation.storage';
import { ActivityLogService } from '../activity-log/activity-log.service';
import {
  ActivityAction,
  EntityType,
} from '../activity-log/schemas/activity-log.schema';
import { AdminRole } from 'src/admin/admin.schema';

@Injectable()
export class SystemLogService {
  private readonly logger = new Logger(SystemLogService.name);

  constructor(
    @InjectModel(SystemLog.name)
    private systemLogModel: Model<SystemLogDocument>,

    @Inject(forwardRef(() => ActivityLogService))
    private readonly activityLogService: ActivityLogService,
  ) {}

  /**
   * Internal method used to record an error or system event.
   */
  async log(dto: CreateSystemLogDto): Promise<void> {
    try {
      // Automatically retrieve the Correlation ID from AsyncLocalStorage
      const correlationId = getCorrelationId();

      const newLog = new this.systemLogModel({
        ...dto,
        correlationId, // Attach the ID if it exists
      });

      await newLog.save();
    } catch (err) {
      this.logger.error(`Failed to log the error : ${err.message}`, err);
    }
  }

  /**
   * Admin method to retrieve paginated logs for the dashboard.
   */
  async findAll(query: {
    page?: number;
    limit?: number;
    method?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    correlationId?: string;
  }) {
    const {
      page = 1,
      limit = 20,
      method,
      search,
      startDate,
      endDate,
      correlationId,
    } = query;
    const skip = (page - 1) * limit;

    const filters: any = {};

    if (correlationId) {
      filters.correlationId = { $regex: correlationId, $options: 'i' };
    }

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      filters.$or = [
        { message: searchRegex },
        { path: searchRegex },
        { errorCode: searchRegex },
        { userUuid: searchRegex },
        { method: searchRegex },
      ];
    }

    if (method && method.toString() !== 'ALL') filters.method = method;

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
      this.systemLogModel
        .find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.systemLogModel.countDocuments(filters).exec(),
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
  }

  /**
   * Checks if the Super Admin is allowed to perform a cleanup.
   * Logic: Must be 30 days since the last recorded cleanup activity.
   */
  async getCleanupStatus(admin: {
    userUuid: string;
    username: string;
    role: string;
  }) {
    try {
      // 1. Find the most recent "Delete Old system logs" activity
      const lastCleanup = await this.activityLogService.findLatest({
        action: ActivityAction.DELETE,
        entityType: EntityType.SYSTEM_LOG,
        entityUuid: 'SYSTEM_CLEANUP',
      });

      if (!lastCleanup) {
        return { canDelete: true, lastCleanup: null, daysRemaining: 0 };
      }

      const lastCleanupDoc = lastCleanup as any;

      const now = new Date();
      const lastDate = new Date(lastCleanupDoc.createdAt);
      const diffTime = Math.abs(now.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const cooldownPeriod = 30;
      const canDelete = diffDays >= cooldownPeriod;

      return {
        canDelete,
        lastCleanup: lastDate,
        daysRemaining: canDelete ? 0 : cooldownPeriod - diffDays,
      };
    } catch (err) {
      this.log({
        errorCode: '500',
        message: err.message,
        stack: err.stack,
        path: 'admin/syslem-logs/cleanupstatus',
        method: 'cleanUpStatus',
        userUuid: admin.userUuid,
      });
    }
  }

  async cleanOldLogs(admin: {
    userUuid: string;
    username: string;
    role: string;
  }) {
    if (admin.role !== AdminRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only Super Admins can clear system logs');
    }

    const status = await this.getCleanupStatus(admin);
    if (!status?.canDelete) {
      throw new ForbiddenException(
        `Cleanup cooldown active. Please wait ${status?.daysRemaining} more days.`,
      );
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await this.systemLogModel
      .deleteMany({ createdAt: { $lt: thirtyDaysAgo } })
      .exec();

    await this.activityLogService.create({
      adminUuid: admin.userUuid,
      adminUserName: admin.username,
      action: ActivityAction.DELETE,
      entityType: EntityType.SYSTEM_LOG,
      entityTitle: 'Delete Old system logs',
      entityUuid: 'SYSTEM_CLEANUP',
    });

    return {
      message: 'Successfully cleared logs older than 30 days',
      deletedCount: result.deletedCount,
    };
  }
}
