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
    return await this.eventModel.find().sort({ date: -1 }).exec();
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

  async findPublished(type: 'upcoming' | 'past' = 'upcoming') {
    const now = new Date();

    const query = {
      status: EventStatus.PUBLISHED,
      date: type === 'upcoming' ? { $gte: now } : { $lt: now },
    };

    const sortOrder = type === 'upcoming' ? 1 : -1;

    return this.eventModel
      .find(query)
      .select('uuid title description date type location -_id')
      .sort({ date: sortOrder })
      .exec();
  }
}
