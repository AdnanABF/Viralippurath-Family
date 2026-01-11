import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { randomUUID } from 'node:crypto';

export type SystemLogDocument = SystemLog & Document;

@Schema({ timestamps: true, collection: 'system_logs' })
export class SystemLog {
  @Prop({ default: () => randomUUID(), unique: true, required: true })
  uuid: string;

  @Prop({ required: true })
  errorCode: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: false })
  stack: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  method: string;

  @Prop({ type: Object, required: false })
  payload: any;

  @Prop({ required: false })
  userUuid: string;

  @Prop({ required: false })
  ipAddress: string;

  @Prop({ required: false })
  correlationId: string;
}

export const SystemLogSchema = SchemaFactory.createForClass(SystemLog);

SystemLogSchema.index({ createdAt: -1 });
SystemLogSchema.index({ errorCode: 1 });
SystemLogSchema.index({ correlationId: 1 });
