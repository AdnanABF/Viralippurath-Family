import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'node:crypto';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

@Schema({ timestamps: true })
export class Event {
  @Prop({ default: () => randomUUID(), unique: true, required: true })
  uuid: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  type: string; // Gathering, Ceremony, Meeting, etc.

  @Prop({ required: true })
  date: Date;

  @Prop()
  location?: string;

  @Prop({
    enum: EventStatus,
    default: EventStatus.DRAFT,
  })
  status: EventStatus;
}

export const EventSchema = SchemaFactory.createForClass(Event);
