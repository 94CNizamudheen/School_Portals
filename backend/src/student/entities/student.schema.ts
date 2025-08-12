

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Student extends Document {
  @Prop({ required: true }) firstName: string;
  @Prop({ required: true }) lastName: string;
  @Prop({ required: true }) classLevel: string;
  @Prop({ required: true, unique: true }) identity: string;
  @Prop({ required: true }) password: string;
  @Prop({ required: true, enum: ['hindu', 'muslim', 'christian', 'sikh', 'parse', 'not_disclose'] })religion:string;
  @Prop({
    required: true,
    enum: [
      'brahmin', 'kshatriya', 'vaishya', 'shudra', 'kurmi', 'yadav', 'nai', 'teli',
      'jaiswal', 'kayastha', 'baniya', 'rajput', 'sc', 'st', 'obc',
      'sunni', 'shia', 'syed', 'pathan', 'sheikh', 'mughal', 'ansari', 'qureshi', 'bohra', 'meman',
      'roman_catholic', 'protestant', 'syro_malabar', 'syro_malankara', 'orthodox', 'pentecostal', 'jacobite',
      'jatt', 'ramgarhia', 'khatri', 'rai', 'ramdassia', 'mazhabi', 'tonk_kshatriya',
      'zoroastrian', 'agnostic', 'not_disclosed'
    ],
  }) cast: string;

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
  @Prop({required:false}) enrollmentDate?:Date
}

export const StudentSchema = SchemaFactory.createForClass(Student);
