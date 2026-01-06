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

  // ADMIN
  async findAllAdmin() {
    return await this.eventModel.find().sort({ startDateTime: -1 }).exec();
  }

  async create(
    dto: CreateEventDto,
    admin: { userUuid: string; username: string },
  ) {
    const newEvent = await this.eventModel.create(dto);

    // Record Activity
    await this.activityLogService.create({
      adminUuid: admin.userUuid,
      adminUserName: admin.username,
      action: ActivityAction.CREATE,
      entityType: EntityType.EVENT,
      entityTitle: newEvent.title,
      entityUuid: newEvent.uuid,
    });

    return newEvent;
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

    // Record Activity
    await this.activityLogService.create({
      adminUuid: admin.userUuid,
      adminUserName: admin.username,
      action: ActivityAction.UPDATE,
      entityType: EntityType.EVENT,
      entityTitle: updatedEvent.title,
      entityUuid: updatedEvent.uuid,
    });

    return updatedEvent;
  }

  async remove(uuid: string, admin: { userUuid: string; username: string }) {
    const deletedEvent = await this.eventModel
      .findOneAndDelete({ uuid })
      .exec();

    if (!deletedEvent) {
      throw new NotFoundException(`Event with UUID ${uuid} not found`);
    }

    // Record Activity
    await this.activityLogService.create({
      adminUuid: admin.userUuid,
      adminUserName: admin.username,
      action: ActivityAction.DELETE,
      entityType: EntityType.EVENT,
      entityTitle: deletedEvent.title,
      entityUuid: deletedEvent.uuid,
    });

    return { deleted: true };
  }

  // ===== PUBLIC =====
  async findPublished(type: 'upcoming' | 'past' | 'ongoing' = 'upcoming') {
    const now = new Date();
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

    return this.eventModel
      .find(query)
      .select(
        'uuid title description startDateTime endDateTime type location -_id',
      )
      .sort(sortOrder)
      .exec();
  }
}
