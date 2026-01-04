import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Document } from 'mongoose';

export type GalleryDocument = Gallery & Document;

export enum GalleryStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

@Schema({ timestamps: true })
export class Gallery {
  @Prop({
    default: () => uuidv4(),
    unique: true,
    required: true,
  })
  uuid: string;

  @Prop({ required: true, trim: true })
  imageUrl: string;

  // New field to store the Cloudinary identifier for deletions/updates
  @Prop({ required: true, trim: true })
  publicId: string;

  @Prop({ required: true, trim: true })
  caption: string;

  @Prop({ required: true })
  album: string;

  @Prop({ required: true })
  year: number;

  @Prop({ enum: GalleryStatus, default: GalleryStatus.DRAFT })
  status: GalleryStatus;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
