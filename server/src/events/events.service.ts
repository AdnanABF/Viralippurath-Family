import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  BadRequestException,
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
    type?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    adminUserUuid?: string;
  }) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        type,
        search,
        startDate,
        endDate,
      } = query;
      const skip = (page - 1) * limit;

      const filters: any = {};
      if (status && status !== 'ALL') filters.status = status;
      if (type && type !== 'ALL') filters.type = type;

      if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        filters.$or = [
          { title_en: searchRegex },
          { title_ml: searchRegex },
          { description_en: searchRegex },
          { description_ml: searchRegex },
          { location: searchRegex },
        ];
      }

      if (startDate || endDate) {
        filters.startDateTime = {};
        if (startDate) filters.startDateTime.$gte = new Date(startDate);
        if (endDate) filters.startDateTime.$lte = new Date(endDate);
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
      const start = new Date(dto.startDateTime);
      const end = new Date(dto.endDateTime);

      if (end <= start) {
        throw new BadRequestException('End date cannot be before start date');
      }

      const newEvent = await this.eventModel.create({
        ...dto,
        startDateTime: start,
        endDateTime: end,
      });

      await this.activityLogService.create({
        adminUuid: admin.userUuid,
        adminUserName: admin.username,
        action: ActivityAction.CREATE,
        entityType: EntityType.EVENT,
        entityTitle: newEvent.title_en,
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
      const updateData: any = { ...dto };

      if (dto.startDateTime)
        updateData.startDateTime = new Date(dto.startDateTime);
      if (dto.endDateTime) updateData.endDateTime = new Date(dto.endDateTime);

      // Logical Validation
      const start = updateData.startDateTime;
      const end = updateData.endDateTime;

      if (start && end && end <= start) {
        throw new BadRequestException('End date cannot be before start date');
      }

      const updatedEvent = await this.eventModel
        .findOneAndUpdate(
          { uuid },
          { $set: updateData },
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
        entityTitle: updatedEvent.title_en,
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
        entityTitle: deletedEvent.title_en,
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

  async findPublished(query: {
    timeline?: 'upcoming' | 'past' | 'ongoing';
    type?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        timeline = 'upcoming',
        type = 'ALL',
        page = 1,
        limit = 10,
      } = query;

      const now = new Date();
      const skip = (page - 1) * limit;

      // 1. Base query for the specific timeline (used for counts)
      const timelineFilter: any = { status: EventStatus.PUBLISHED };
      let sortOrder: any = { startDateTime: 1 };

      switch (timeline) {
        case 'ongoing':
          timelineFilter.startDateTime = { $lte: now };
          timelineFilter.endDateTime = { $gte: now };
          break;
        case 'upcoming':
          timelineFilter.startDateTime = { $gt: now };
          break;
        case 'past':
          timelineFilter.endDateTime = { $lt: now };
          sortOrder = { startDateTime: -1 };
          break;
      }

      // 2. Data-specific filter (includes category)
      const dataFilter = { ...timelineFilter };
      if (type && type !== 'ALL') {
        dataFilter.type = type;
      }

      // 3. Facet Aggregation
      const result = await this.eventModel
        .aggregate([
          {
            $facet: {
              // Branch: Paginated Data
              data: [
                { $match: dataFilter },
                { $sort: sortOrder },
                { $skip: skip },
                { $limit: limit },
                {
                  $project: {
                    _id: 0,
                    uuid: 1,
                    title_en: 1,
                    title_ml: 1,
                    description_en: 1,
                    description_ml: 1,
                    startDateTime: 1,
                    endDateTime: 1,
                    type: 1,
                    location: 1,
                  },
                },
              ],
              // Branch: Total count for current filter (pagination)
              totalCount: [{ $match: dataFilter }, { $count: 'count' }],
              // Branch: Counts per type for the whole timeline (filter pills)
              typeCounts: [
                { $match: timelineFilter },
                { $group: { _id: '$type', count: { $sum: 1 } } },
              ],
            },
          },
        ])
        .exec();

      const totalItems = result[0].totalCount[0]?.count || 0;
      const rawTypeCounts = result[0].typeCounts || [];

      // Format counts to: { MARRIAGE: 5, GENERAL: 2 }
      const formattedTypeCounts = rawTypeCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {});

      return {
        data: result[0].data,
        meta: {
          totalItems,
          itemCount: result[0].data.length,
          itemsPerPage: Number(limit),
          totalPages: Math.ceil(totalItems / limit),
          currentPage: Number(page),
          typeCounts: formattedTypeCounts,
          totalInView: Object.values(formattedTypeCounts).reduce(
            (a: number, b: number) => a + b,
            0,
          ) as number,
        },
      };
    } catch (error) {
      await this.handleError(error, 'GET', '/public/events', query, 'GUEST');
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
