
import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Otp extends Document{
    @Prop({required:true})
    email:string
    @Prop({required:true})
    password:string
    @Prop({required:true})
    expireAt:Date
};

export const OtpSchema= SchemaFactory.createForClass(Otp);