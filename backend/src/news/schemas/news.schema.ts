import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class News extends Document {
  @Prop({required: true, unique: true})
  title: string;

  @Prop({required: true, unique: true})
  url: string;

  @Prop({required: true})
  author: string;

  @Prop({required: true})
  createdAt: Date;

  @Prop({default: false})
  deleted: boolean;
}

export const NewsSchema = SchemaFactory.createForClass(News);