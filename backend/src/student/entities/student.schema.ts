

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Student extends Document {
  @Prop({ required: true }) firstName: string;
  @Prop({ required: true }) lastName: string;
  @Prop({ required: true }) classLevel: string;
  @Prop({ required: true, unique: true }) identity: string;
  @Prop({ required: true }) password: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Admission', required: true }) admissionId: Types.ObjectId;
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Parent', default: [] }) parentIds?: Types.ObjectId[];
  @Prop({ required: false, unique: true }) rollNumber?: string;

  @Prop({ required: false }) class?: string;
  @Prop({ required: false }) dob?: Date;
  @Prop({ required: false, enum: ['male', 'female', 'transgender'] }) gender?: string;
  @Prop({ required: false }) bloodGroup?: string;
  @Prop({ required: false }) nationality?: string;
  @Prop({ required: false }) address?: string;
  @Prop({ required: false }) state?: string;
  @Prop({ required: false }) pincode?: string;
  @Prop({ required: false }) mobileNumber?: string;
  @Prop({ required: false }) email?: string;
  @Prop({ required: false }) previousSchool?: string;
  @Prop({ required: false }) medicalInformation?: string;
  @Prop({ required: false }) profilePicture?: string;

  @Prop({ default: true }) isActive: boolean;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
