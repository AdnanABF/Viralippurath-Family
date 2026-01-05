import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'node:crypto';
import { Document } from 'mongoose';

export type MagazineDocument = Magazine & Document;

export enum MagazineStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

@Schema({ timestamps: true })
export class Magazine {
  @Prop({
    default: () => randomUUID(),
    unique: true,
    required: true,
  })
  uuid: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  publishedDate: Date;

  // The primary source from Cloudinary
  @Prop({ required: true, trim: true })
  pdfUrl: string;

  // We can store the Cloudinary Public ID to make deletion easier later
  @Prop({ required: true, trim: true })
  cloudinaryPublicId: string;

  @Prop({
    type: String,
    enum: MagazineStatus,
    default: MagazineStatus.DRAFT,
  })
  status: MagazineStatus;
}

export const MagazineSchema = SchemaFactory.createForClass(Magazine);
