
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class VerificationToken extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true, expires: "24h" }) // Expires after 24 hours
  expiresAt: Date;
}

export const VerificationTokenSchema = SchemaFactory.createForClass(VerificationToken);