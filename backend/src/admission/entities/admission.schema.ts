import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdmissionDocument = Admission & Document;

@Schema({ timestamps: true })
export class Admission {
  @Prop({ required: true }) firstName: string;
  @Prop({ required: true }) lastName: string;
  @Prop({ required: true }) dob: Date;
  @Prop({ required: true }) address: string;
  @Prop({ required: true  }) profilePicture: string;
  @Prop({ required: true  }) bloodGroup: string;
  @Prop({ required: true  }) aadharDocument: string;
  @Prop({ required: true  }) birthCertificate: string;
  @Prop({ required: false }) previousSchool: string;
  @Prop({ required: false }) transferCertificate: string;
  @Prop({ required: false }) medicalInformation: string;
  @Prop({ required: true }) parentName: string;
  @Prop({ required: true }) relationToStudent: string;
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) mobileNumber: string;
  @Prop({ required: true  }) emergencyContactName: string;
  @Prop({ required: true  }) emergencyContactNumber: string;
  @Prop({ required: false }) parentOccupation: string;
  @Prop({ required: true }) classApplied: string;
  @Prop({ default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] }) status: string;
}

export const AdmissionSchema = SchemaFactory.createForClass(Admission);