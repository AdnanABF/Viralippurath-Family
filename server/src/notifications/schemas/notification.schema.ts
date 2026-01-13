import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'node:crypto';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum NotificationCategory {
  GENERAL = 'GENERAL',
  MAGAZINE = 'MAGAZINE',
  EVENT = 'EVENT',
  URGENT = 'URGENT',
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
  title_en: string;

  @Prop({ required: false, trim: true })
  title_ml?: string;

  @Prop({ required: true, trim: true })
  content_en: string;

  @Prop({ required: false, trim: true })
  content_ml?: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  isPinned: boolean;

  @Prop({
    type: String,
    enum: NotificationCategory,
    default: NotificationCategory.GENERAL,
  })
  category: NotificationCategory;

  @Prop({
    type: String,
    enum: NotificationStatus,
    default: NotificationStatus.DRAFT,
  })
  status: NotificationStatus;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
