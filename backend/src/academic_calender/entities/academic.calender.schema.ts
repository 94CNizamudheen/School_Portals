import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { CalendarType } from "../types/CalenderType.enums";

@Schema({timestamps:true})
export class AcademicCalendar extends Document{
   @Prop({required:true})title:string;
   @Prop()description?:string;
   @Prop({required:true,unique:true})date:Date;
   @Prop()endDate:Date;
   @Prop({enum:CalendarType,default:CalendarType.HOLIDAY})type: CalendarType; 
   @Prop() academicYear:string;
   @Prop({type:[Types.ObjectId],ref: "ClassDivision", default: []}) applicableClassDivisions:Types.ObjectId[];
};
export const AcademicCalendarSchema= SchemaFactory.createForClass(AcademicCalendar);
