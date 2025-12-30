import { Injectable } from '@nestjs/common';
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
  create(dto: CreateEventDto) {
    return this.eventModel.create(dto);
  }

  findAllAdmin() {
    return this.eventModel.find().sort({ date: -1 });
  }

  update(id: string, dto: UpdateEventDto) {
    return this.eventModel.findByIdAndUpdate(id, dto, { new: true });
  }

  remove(id: string) {
    return this.eventModel.findByIdAndDelete(id);
  }

  // PUBLIC
  findPublished() {
    return this.eventModel
      .find({ status: EventStatus.PUBLISHED })
      .sort({ date: -1 });
  }
}
