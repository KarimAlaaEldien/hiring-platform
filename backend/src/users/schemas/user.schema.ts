import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum Role {
  COMPANY = 'Company',
  DEVELOPER = 'Developer',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: Role })
  role: Role;

  @Prop()
  refreshToken?: string;
  
  // Developer fields
  @Prop()
  resumeUrl?: string;

  @Prop()
  bio?: string;

  @Prop()
  title?: string;

  @Prop()
  company?: string;
  
  @Prop([String])
  savedJobs?: string[];
  
  // Company fields
  @Prop()
  companyName?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
