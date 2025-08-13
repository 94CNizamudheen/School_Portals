import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({timestamps:true})
export class ClassDivision{
    @Prop({required:true}) divisionName:string;
    @Prop({type:[String],default:[]}) subjects:string[]
    @Prop({type:Types.ObjectId,ref:'Teacher',required:true}) classTeacherId:Types.ObjectId;
    @Prop({type:[{type:Types.ObjectId,ref:'Student'}],default:[]}) assignedStudents:Types.ObjectId
}