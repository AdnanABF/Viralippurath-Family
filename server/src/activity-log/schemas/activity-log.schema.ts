import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { randomUUID } from 'node:crypto';

export type ActivityLogDocument = ActivityLog & Document;

export enum ActivityAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export enum EntityType {
  EVENT = 'EVENT',
  MAGAZINE = 'MAGAZINE',
  NOTIFICATION = 'NOTIFICATION',
  GALLERY = 'GALLERY',
  ADMIN = 'ADMIN',
}

@Schema({ timestamps: true })
export class ActivityLog {
  @Prop({ default: () => randomUUID(), unique: true, required: true })
  uuid: string;

  @Prop({ required: true, index: true })
  adminUuid: string;

  @Prop({ required: true })
  adminUserName: string;

  @Prop({
    type: String,
    enum: ActivityAction,
    required: true,
  })
  action: ActivityAction;

  @Prop({
    type: String,
    enum: EntityType,
    required: true,
  })
  entityType: EntityType;

  @Prop({ required: true })
  entityTitle: string;

  @Prop({ required: false })
  entityUuid?: string;

  @Prop({ required: false })
  correlationId: string;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

ActivityLogSchema.index({ correlationId: 1 });
