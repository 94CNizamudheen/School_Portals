
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Student extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  mobileNumber: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  gender: string;

  @Prop()
  bloodGroup: string;

  @Prop()
  nationality: string;

  @Prop()
  religion: string;

  @Prop()
  grade: string;

  @Prop()
  class: string;

  @Prop()
  rollNumber: string;

  @Prop()
  previousSchool: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  pincode: string;

  @Prop()
  medicalConditions: string;

  @Prop()
  allergies: string;

  @Prop()
  medications: string;

  @Prop()
  profileImage: string;
  
  @Prop({ type: [{ type: Types.ObjectId, ref: "Parent" }] })
  parentIds: Types.ObjectId[];

  @Prop()
  enrollmentDate: Date;
  
  @Prop({default:true})
  isActive: boolean;
}

export const StudentSchema = SchemaFactory.createForClass(Student);