import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type JobDocument = Job & Document;

@Schema({ timestamps: false })
export class Job {
  @Prop({ required: true })
  title: string;

  @Prop()
  company: string;

  @Prop()
  description: string;

  @Prop()
  location: string;

  @Prop()
  type: string;

  @Prop()
  salary: string;

  @Prop([String])
  tags: string[];

  @Prop({ default: 'open' })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  companyId: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
