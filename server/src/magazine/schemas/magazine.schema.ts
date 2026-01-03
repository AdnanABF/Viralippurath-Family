import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Document } from 'mongoose';

export type MagazineDocument = Magazine & Document;

export enum MagazineStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

@Schema({ timestamps: true })
export class Magazine {
  @Prop({
    default: () => uuidv4(),
    unique: true,
    required: true,
  })
  uuid: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  publishedDate: Date;

  @Prop({ trim: true })
  coverImageUrl?: string;

  @Prop({ required: true, trim: true })
  flipbookUrl: string;

  @Prop({ trim: true })
  downloadUrl?: string;

  @Prop({
    type: String,
    enum: MagazineStatus,
    default: MagazineStatus.DRAFT,
  })
  status: MagazineStatus;
}

export const MagazineSchema = SchemaFactory.createForClass(Magazine);
