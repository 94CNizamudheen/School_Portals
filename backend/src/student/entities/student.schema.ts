

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Student extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  classLevel: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Parent' }], default: [] })
  parentIds: Types.ObjectId[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);