import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'node:crypto';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum NotificationPriority {
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({
    default: () => randomUUID(),
    unique: true,
    required: true,
  })
  uuid: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  content: string;

  @Prop({ required: true })
  date: Date;

  @Prop({
    enum: NotificationPriority,
    default: NotificationPriority.NORMAL,
  })
  priority: NotificationPriority;

  @Prop({
    enum: NotificationStatus,
    default: NotificationStatus.DRAFT,
  })
  status: NotificationStatus;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
