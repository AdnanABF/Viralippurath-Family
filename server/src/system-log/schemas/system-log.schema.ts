import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { randomUUID } from 'node:crypto';

export type SystemLogDocument = SystemLog & Document;

@Schema({ timestamps: true, collection: 'system_logs' })
export class SystemLog {
  @Prop({ default: randomUUID(), unique: true, required: true })
  uuid: string;

  @Prop({ required: true })
  errorCode: string; // e.g., '500', 'E11000', '409'

  @Prop({ required: true })
  message: string; // Friendly error message or error description

  @Prop({ required: false })
  stack: string; // The full technical stack trace

  @Prop({ required: true })
  path: string; // The API endpoint (e.g., /api/events)

  @Prop({ required: true })
  method: string; // HTTP Method: GET, POST, PUT, DELETE

  @Prop({ type: Object, required: false })
  payload: any; // The request body or params that caused the error

  @Prop({ required: false })
  userUuid: string; // The ID of the user who was logged in (if any)

  @Prop({ required: false })
  ipAddress: string; // IP of the requester for security auditing
}

export const SystemLogSchema = SchemaFactory.createForClass(SystemLog);

// Add an index for performance when searching logs by date or type
SystemLogSchema.index({ createdAt: -1 });
SystemLogSchema.index({ errorCode: 1 });
