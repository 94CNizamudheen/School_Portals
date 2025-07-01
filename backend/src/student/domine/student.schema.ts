
import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document,Types } from "mongoose";

@Schema()
export class Student extends Document{
    @Prop({required:true})
    name:string
    @Prop({required:true,unique:true})
    email:string
    @Prop({required:true,unique:true})
    mobileNumber:string
    @Prop()
    dob:Date;
    @Prop()
    parantName?:string
    @Prop()
    address?:string;
    @Prop()
    bloodGroup?:string;
    @Prop()
    grade?:string
    @Prop()
    enrollmentDate?:Date;
    @Prop([{type:Types.ObjectId,ref:'Parent'}])
    parentIds?:Types.ObjectId[];
};
export const StudentSchema = SchemaFactory.createForClass(Student);