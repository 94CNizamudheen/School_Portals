import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({timestamps:true})
export class Payment extends Document{
    @Prop({required:true})studentId:string
    @Prop({required:true})amount:string;
    @Prop({required:true})transactionId:string;
    @Prop({required:true,default:'pending',enum:['pending','completed']})status:string;
}

export const PaymentSchema= SchemaFactory.createForClass(Payment);
