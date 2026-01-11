import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SystemLog, SystemLogDocument } from './schemas/system-log.schema';
import { CreateSystemLogDto } from './dto/create-system-log.dto';
import { getCorrelationId } from '../common/correlation/correlation.storage';

@Injectable()
export class SystemLogService {
  private readonly logger = new Logger(SystemLogService.name);

  constructor(
    @InjectModel(SystemLog.name)
    private systemLogModel: Model<SystemLogDocument>,
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
    errorCode?: string;
    correlationId?: string;
  }) {
    const { page = 1, limit = 20, errorCode, correlationId } = query;
    const skip = (page - 1) * limit;

    const filters: any = {};
    if (errorCode) filters.errorCode = errorCode;
    // Added ability to filter by correlationId to see all logs for one request
    if (correlationId) filters.correlationId = correlationId;

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

  async cleanOldLogs() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.systemLogModel
      .deleteMany({ createdAt: { $lt: thirtyDaysAgo } })
      .exec();
  }
}
