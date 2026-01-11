import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument, EventStatus } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { SystemLogService } from '../system-log/system-log.service';
import {
  ActivityAction,
  EntityType,
} from '../activity-log/schemas/activity-log.schema';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
    private readonly activityLogService: ActivityLogService,
    private readonly systemLogService: SystemLogService,
  ) {}

  // ADMIN - Paginated with Multi-field Search, Filters, and Date Range
  async findAllAdmin(query: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    adminUserUuid?: string; // Passed for logging purposes
  }) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        search,
        startDate,
        endDate,
      } = query;
      const skip = (page - 1) * limit;

      const filters: any = {};
      if (status && status !== 'ALL') filters.status = status;

      if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        filters.$or = [
          { title: searchRegex },
          { description: searchRegex },
          { type: searchRegex },
          { location: searchRegex },
        ];
      }

      if (startDate || endDate) {
        filters.startDateTime = {};
        if (startDate) filters.startDateTime.$gte = new Date(startDate);
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          filters.startDateTime.$lte = end;
        }
      }

      const [data, totalItems] = await Promise.all([
        this.eventModel
          .find(filters)
          .sort({ startDateTime: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.eventModel.countDocuments(filters).exec(),
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
        '/admin/events',
        query,
        query.adminUserUuid,
      );
      throw new InternalServerErrorException('Failed to fetch admin events');
    }
  }

  async create(
    dto: CreateEventDto,
    admin: { userUuid: string; username: string },
  ) {
    try {
      const newEvent = await this.eventModel.create(dto);

      await this.activityLogService.create({
        adminUuid: admin.userUuid,
        adminUserName: admin.username,
        action: ActivityAction.CREATE,
        entityType: EntityType.EVENT,
        entityTitle: newEvent.title,
        entityUuid: newEvent.uuid,
      });

      return {
        data: newEvent,
        message: 'Event created successfully',
      };
    } catch (error) {
      await this.handleError(
        error,
        'POST',
        '/admin/events',
        dto,
        admin.userUuid,
      );

      if (error.code === 11000) {
        throw new ConflictException(
          'An event with this unique attribute already exists',
        );
      }
      throw new InternalServerErrorException('Failed to create event');
    }
  }

  async update(
    uuid: string,
    dto: UpdateEventDto,
    admin: { userUuid: string; username: string },
  ) {
    try {
      const updatedEvent = await this.eventModel
        .findOneAndUpdate(
          { uuid },
          { $set: dto },
          { new: true, runValidators: true },
        )
        .exec();

      if (!updatedEvent) {
        throw new NotFoundException(`Event with UUID ${uuid} not found`);
      }

      await this.activityLogService.create({
        adminUuid: admin.userUuid,
        adminUserName: admin.username,
        action: ActivityAction.UPDATE,
        entityType: EntityType.EVENT,
        entityTitle: updatedEvent.title,
        entityUuid: updatedEvent.uuid,
      });

      return {
        data: updatedEvent,
        message: 'Event details updated successfully',
      };
    } catch (error) {
      await this.handleError(
        error,
        'PATCH',
        `/admin/events/${uuid}`,
        dto,
        admin.userUuid,
      );
      if (error.getStatus && typeof error.getStatus === 'function') {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update event');
    }
  }

  async remove(uuid: string, admin: { userUuid: string; username: string }) {
    try {
      const deletedEvent = await this.eventModel
        .findOneAndDelete({ uuid })
        .exec();

      if (!deletedEvent) {
        throw new NotFoundException(`Event with UUID ${uuid} not found`);
      }

      await this.activityLogService.create({
        adminUuid: admin.userUuid,
        adminUserName: admin.username,
        action: ActivityAction.DELETE,
        entityType: EntityType.EVENT,
        entityTitle: deletedEvent.title,
        entityUuid: deletedEvent.uuid,
      });

      return {
        data: { success: true },
        message: 'Event deleted successfully',
      };
    } catch (error) {
      await this.handleError(
        error,
        'DELETE',
        `/admin/events/${uuid}`,
        null,
        admin.userUuid,
      );
      if (error.getStatus && typeof error.getStatus === 'function') {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete event');
    }
  }

  async findPublished(
    type: 'upcoming' | 'past' | 'ongoing' = 'upcoming',
    page: number = 1,
    limit: number = 10,
  ) {
    try {
      const now = new Date();
      const skip = (page - 1) * limit;

      let query: any = { status: EventStatus.PUBLISHED };
      let sortOrder: any = { startDateTime: 1 };

      switch (type) {
        case 'ongoing':
          query.startDateTime = { $lte: now };
          query.endDateTime = { $gte: now };
          sortOrder = { startDateTime: 1 };
          break;
        case 'upcoming':
          query.startDateTime = { $gt: now };
          sortOrder = { startDateTime: 1 };
          break;
        case 'past':
          query.endDateTime = { $lt: now };
          sortOrder = { startDateTime: -1 };
          break;
      }

      const [data, totalItems] = await Promise.all([
        this.eventModel
          .find(query)
          .select(
            'uuid title description startDateTime endDateTime type location -_id',
          )
          .sort(sortOrder)
          .skip(skip)
          .limit(limit)
          .exec(),
        this.eventModel.countDocuments(query).exec(),
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
      // For public routes, userUuid is likely undefined
      await this.handleError(
        error,
        'GET',
        '/public/events',
        { type, page, limit },
        'GUEST',
      );
      throw new InternalServerErrorException('Failed to fetch events');
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
      userUuid: userUuid || 'GUEST',
    });
  }
}
