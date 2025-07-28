import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema({timestamps:true})
export class Payment extends Document{
    @Prop({required:true})admissionId:string 
    @Prop()parentId?:string;
    @Prop()studentId?:string;
    @Prop({required:true})amount:number;
    @Prop({required:true})transactionId:string;
    @Prop({required:true,default:'pending',enum:['pending','success','failed']})status:string;
}

export const PaymentSchema= SchemaFactory.createForClass(Payment);
