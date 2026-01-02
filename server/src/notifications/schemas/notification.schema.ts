import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;
export type NotificationStatus = 'DRAFT' | 'PUBLISHED';
export type NotificationPriority = 'HIGH' | 'NORMAL';

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content?: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ enum: ['HIGH', 'NORMAL'], default: 'NORMAL' })
  priority: NotificationPriority;

  @Prop({ enum: ['DRAFT', 'PUBLISHED'], default: 'DRAFT' })
  status: NotificationStatus;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
