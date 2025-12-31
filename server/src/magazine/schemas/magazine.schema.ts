import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MagazineDocument = Magazine & Document;
export type MagazineStatus = 'DRAFT' | 'PUBLISHED';

@Schema({ timestamps: true })
export class Magazine {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  year: number;

  @Prop()
  coverImageUrl?: string;

  @Prop({ required: true })
  flipbookUrl: string;

  @Prop()
  downloadUrl?: string;

  @Prop({ enum: ['DRAFT', 'PUBLISHED'], default: 'DRAFT' })
  status: MagazineStatus;
}

export const MagazineSchema = SchemaFactory.createForClass(Magazine);
