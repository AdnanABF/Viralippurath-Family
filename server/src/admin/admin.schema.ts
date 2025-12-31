import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: ['SUPER_ADMIN', 'ADMIN'] })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  refreshTokenHash?: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
