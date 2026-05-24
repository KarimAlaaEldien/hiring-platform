import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ApplicationDocument = Application & Document;

export enum ApplicationStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
}

@Schema({ timestamps: true })
export class Application {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true })
  jobId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  developerId: string;

  @Prop()
  coverLetter?: string;

  @Prop({ required: true })
  resumeUrl: string;

  @Prop({ required: true, enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status: ApplicationStatus;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
