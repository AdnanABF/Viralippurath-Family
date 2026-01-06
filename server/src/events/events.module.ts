import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event, EventSchema } from './schemas/event.schema';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    ActivityLogModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
