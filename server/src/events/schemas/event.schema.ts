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
  title_en: string;

  @Prop({ required: false, trim: true })
  title_ml?: string;

  @Prop({ required: true })
  description_en: string;

  @Prop({ required: false, trim: true })
  description_ml?: string;

  @Prop({ required: true })
  type: string; // Gathering, Ceremony, Meeting, etc.

  @Prop({ required: true })
  startDateTime: Date;

  @Prop({
    required: true,
    validate: {
      validator: function (this: any, value: Date) {
        return value >= this.startDateTime;
      },
      message: 'End date-time must be equal to or after start date-time',
    },
  })
  endDateTime: Date; // New field

  @Prop({ required: true })
  location?: string;

  @Prop({
    enum: EventStatus,
    default: EventStatus.DRAFT,
  })
  status: EventStatus;
}

export const EventSchema = SchemaFactory.createForClass(Event);
