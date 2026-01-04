import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'node:crypto';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

@Schema({ timestamps: true })
export class Admin {
  @Prop({ default: () => randomUUID(), unique: true, required: true })
  uuid: string;

  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({
    type: String,
    enum: AdminRole,
    default: AdminRole.ADMIN,
  })
  role: AdminRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  refreshTokenHash?: string;

  @Prop()
  lastLogin?: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
