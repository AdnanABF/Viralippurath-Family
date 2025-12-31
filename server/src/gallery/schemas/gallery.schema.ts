import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GalleryDocument = Gallery & Document;

export type GalleryStatus = 'DRAFT' | 'PUBLISHED';

@Schema({ timestamps: true })
export class Gallery {
  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  caption: string;

  @Prop({ required: true })
  album: string;

  @Prop({ required: true })
  year: number;

  @Prop({ enum: ['DRAFT', 'PUBLISHED'], default: 'DRAFT' })
  status: GalleryStatus;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
