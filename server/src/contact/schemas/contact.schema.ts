import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { randomUUID } from 'node:crypto';

@Schema({ timestamps: true })
export class Contact extends Document {
  @Prop({ default: randomUUID() })
  uuid: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
