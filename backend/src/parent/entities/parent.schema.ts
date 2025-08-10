import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Parent extends Document {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) email: string;
  @Prop({ required: true }) mobileNumber: string;
  @Prop() occupation?: string;

  @Prop({
    type: [
      {
        admissionId: { type: Types.ObjectId, ref: "Admission" },
        relationship: String,
      },
    ],
    default: [],
  })
  relations: { admissionId: Types.ObjectId; relationship: string }[];

  @Prop({ type: [{ type: Types.ObjectId, ref: "Admission" }], default: [] })
  admissionIds: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: "Student" }], default: [] })
  studentIds: Types.ObjectId[];

  @Prop() emergencyContactName?: string;
  @Prop() emergencyContactPhone?: string;
}

export const ParentSchema = SchemaFactory.createForClass(Parent);
