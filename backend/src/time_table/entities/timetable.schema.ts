import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


@Schema({timestamps:true})
export class TimetableSlot extends Document{
    @Prop({ref:'ClassDivision',required:true}) division:Types.ObjectId
    @Prop({required:true}) day:string;
    @Prop({required:true}) date:Date;
    @Prop({required:true}) startTime:string;
    @Prop({required:true}) endTime:string;
    @Prop({required:true}) subject:string;
    @Prop({required:true}) subjectId:string;
    @Prop({ref:'Teacher',required:true}) teacher:Types.ObjectId;
    @Prop() teacherName?:string;
    @Prop() color?:string;
    @Prop() classLevel?:string;
}
export const TimetableSlotSchema= SchemaFactory.createForClass(TimetableSlot);
TimetableSlotSchema.index({division:1,date:1})