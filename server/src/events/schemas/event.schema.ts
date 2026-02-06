import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'node:crypto';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum EventType {
  GENERAL = 'GENERAL',
  MARRIAGE = 'MARRIAGE',
  FUNERAL = 'FUNERAL',
  GATHERING = 'GATHERING',
  NEWBORN = 'NEWBORN',
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

  @Prop({
    required: true,
    type: String,
    enum: EventType,
    default: EventType.GENERAL,
  })
  type: EventType;

  @Prop({ required: true })
  startDateTime: Date;

  @Prop({
    required: true,
    validate: {
      validator: function (value: Date) {
        // 'this' can be a Document or a Query
        // For updates, we look into the update object
        const startDateTime =
          this instanceof Document
            ? this.startDateTime
            : (this as any).getUpdate().$set?.startDateTime ||
              (this as any).getUpdate().startDateTime;

        // If we are updating only the end date and not the start date,
        // we might not have startDateTime in the update object.
        // In that case, we can skip validation or fetch the doc (expensive).
        // A better practice is to ensure both are sent or use a service-level check.

        if (!startDateTime) return true;

        return value >= startDateTime;
      },
      message: 'End date-time must be equal to or after start date-time',
    },
  })
  endDateTime: Date;

  @Prop({ required: true })
  location?: string;

  @Prop({
    enum: EventStatus,
    default: EventStatus.DRAFT,
  })
  status: EventStatus;
}

export const EventSchema = SchemaFactory.createForClass(Event);
