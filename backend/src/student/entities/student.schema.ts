

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Student extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  dob: Date;

  @Prop({ required: true })
  classLevel: string;

  @Prop({required:true})
  identity:string

  @Prop({type:Types.ObjectId,ref:"Admission",required:true})admissionId:string 

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Parent' }], default: [] })
  parentIds: Types.ObjectId[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);