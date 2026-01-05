import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument, EventStatus } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
  ) {}

  // ADMIN
  async findAllAdmin() {
    return await this.eventModel.find().sort({ startDateTime: -1 }).exec();
  }

  async create(dto: CreateEventDto) {
    return await this.eventModel.create(dto);
  }

  async update(uuid: string, dto: UpdateEventDto) {
    const updatedEvent = await this.eventModel
      .findOneAndUpdate({ uuid }, { $set: dto }, { new: true })
      .exec();

    if (!updatedEvent) {
      throw new NotFoundException(`Event with UUID ${uuid} not found`);
    }

    return updatedEvent;
  }

  async remove(uuid: string) {
    const deletedEvent = await this.eventModel
      .findOneAndDelete({ uuid })
      .exec();

    if (!deletedEvent) {
      throw new NotFoundException(`Event with UUID ${uuid} not found`);
    }

    return { deleted: true };
  }

  // ===== PUBLIC =====

  async findPublished(type: 'upcoming' | 'past' | 'ongoing' = 'upcoming') {
    const now = new Date();
    let query: any = { status: EventStatus.PUBLISHED };
    let sortOrder: any = { startDateTime: 1 };

    switch (type) {
      case 'ongoing':
        // Started in the past (or now) AND ends in the future (or now)
        query.startDateTime = { $lte: now };
        query.endDateTime = { $gte: now };
        sortOrder = { startDateTime: 1 };
        break;

      case 'upcoming':
        // Starts in the future
        query.startDateTime = { $gt: now };
        sortOrder = { startDateTime: 1 }; // Soonest first
        break;

      case 'past':
        // Ended in the past
        query.endDateTime = { $lt: now };
        sortOrder = { startDateTime: -1 }; // Most recent first
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
