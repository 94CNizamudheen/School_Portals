import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


@Schema({timestamps:true})
export class Subject extends Document{
    @Prop({required:true}) name:string;
    @Prop({enum:['Core','Language','Elective'],default:'Core'}) subjectType: string;
    @Prop([{type:Types.ObjectId,ref:'Teacher'}]) assignedTeachers?:Types.ObjectId[] ;
    @Prop({type:Number,default:100}) totalMark?:number;
    @Prop({type:Number,default:35}) passMark?:number;
};

export const SubjectSchema=  SchemaFactory.createForClass(Subject);