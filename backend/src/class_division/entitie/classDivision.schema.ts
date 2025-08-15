import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({timestamps:true})
export class ClassDivision extends Document{
    @Prop({required:true}) divisionName:string;
    @Prop({required:true}) classLevel:string;
    @Prop({type:[String],default:[]}) subjects:string[]
    @Prop({type:Types.ObjectId,ref:'Teacher',required:true}) classTeacherId:Types.ObjectId;
    @Prop({type:[{type:Types.ObjectId,ref:'Student'}],default:[]}) assignedStudents:Types.ObjectId
}
export const ClassDivisionSchema = SchemaFactory.createForClass(ClassDivision);