import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument, EventStatus } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import {
  ActivityAction,
  EntityType,
} from '../activity-log/schemas/activity-log.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
    private readonly activityLogService: ActivityLogService,
  ) {}

  // ADMIN - Paginated with Multi-field Search, Filters, and Date Range
  async findAllAdmin(query: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    startDate?: string; // Expecting ISO string or YYYY-MM-DD
    endDate?: string; // Expecting ISO string or YYYY-MM-DD
  }) {
    const { page = 1, limit = 10, status, search, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const filters: any = {};

    // 1. Status Filter
    if (status && status !== 'ALL') filters.status = status;

    // 2. Multi-field Search (Title, Description, or Type)
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      filters.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { type: searchRegex },
        { location: searchRegex },
      ];
    }

    // 3. Date Range Filter
    if (startDate || endDate) {
      filters.startDateTime = {};
      if (startDate) {
        filters.startDateTime.$gte = new Date(startDate);
      }
      if (endDate) {
        // We set the end date to the very end of the day (23:59:59)
        // to ensure events on that day are included
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

  async create(
    dto: CreateEventDto,
    admin: { userUuid: string; username: string },
  ) {
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
  }

  async update(
    uuid: string,
    dto: UpdateEventDto,
    admin: { userUuid: string; username: string },
  ) {
    const updatedEvent = await this.eventModel
      .findOneAndUpdate({ uuid }, { $set: dto }, { new: true })
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
  }

  async remove(uuid: string, admin: { userUuid: string; username: string }) {
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
  }

  async findPublished(
    type: 'upcoming' | 'past' | 'ongoing' = 'upcoming',
    page: number = 1,
    limit: number = 10,
  ) {
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
  }
}
