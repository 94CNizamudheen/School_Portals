
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Parent extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  mobileNumber: string;

  @Prop()
  occupation: string;

  @Prop()
  relationship: string;

  @Prop()
  emergencyContactName: string;

  @Prop()
  emergencyContactPhone: string;

  @Prop()
  emergencyContactRelationship: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Student" }],default: [] })
  studentIds: Types.ObjectId[];
}

export const ParentSchema = SchemaFactory.createForClass(Parent);