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

  @Prop({
    required: true,
    validate: {
      validator: function (value: Date) {
        // 'this' can be a Document or a Query
        // For updates, we look into the update object
        const date =
          this instanceof Document
            ? this.date
            : (this as any).getUpdate().$set?.date ||
              (this as any).getUpdate().date;

        // If we are updating only the end date and not the start date,
        // we might not have startDateTime in the update object.
        // In that case, we can skip validation or fetch the doc (expensive).
        // A better practice is to ensure both are sent or use a service-level check.

        if (!date) return true;

        return value >= date;
      },
      message: 'Expiry date must be equal to or after publish date',
    },
  })
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
