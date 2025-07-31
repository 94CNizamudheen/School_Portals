import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ timestamps: true })
export class Admission extends Document {
  @Prop({ required: true }) firstName: string;
  @Prop({ required: true }) lastName: string;
  @Prop({ required: true }) dob: Date;
  @Prop({ required: true, enum: ['male', 'female', 'transgender'] }) gender: string;
  @Prop({ required: true, enum: ['hindu', 'muslim', 'christian', 'sikh', 'parse', 'not_disclose'] }) religion:string
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

  @Prop({ required: true }) address: string;
  @Prop({ required: true }) state: string;
  @Prop({ required: true }) nationality: string;
  @Prop({ required: true }) pincode: string;
  @Prop({ required: true }) profilePicture: string;
  @Prop({ required: true }) bloodGroup: string;
  @Prop({ required: true }) aadharDocument: string;
  @Prop({ required: true }) birthCertificate: string;
  @Prop({ required: false }) previousSchool: string;
  @Prop({ required: false }) transferCertificate: string;
  @Prop({ required: false }) medicalInformation: string;
  @Prop({ required: true }) parentName: string;
  @Prop({ required: true }) relationToStudent: string;
  @Prop({ required: true }) email: string;
  @Prop({ required: true }) mobileNumber: string;
  @Prop({ required: true }) emergencyContactName: string;
  @Prop({ required: true }) emergencyContactNumber: string;
  @Prop({ required: false }) parentOccupation: string;
  @Prop({ required: true }) classApplied: string;
  @Prop() rollNumber?: string;

  @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected', 'completed'] }) status: string;
  @Prop() verificationNotes?: string;
  @Prop() rejectionReason?: string;

}

export const AdmissionSchema = SchemaFactory.createForClass(Admission);