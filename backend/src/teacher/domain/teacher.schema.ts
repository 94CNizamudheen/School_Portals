

import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema()
export class Teacher extends Document{
    @Prop({required:true})
    name:string;
    @Prop({required:true,unique:true})
    email:string;
    @Prop({required:true,unique:true})
    mobileNumber:string;
    @Prop()
    dob?:Date
    @Prop()
    qualification?:string;
    @Prop()
    experienceYears?:number;
    @Prop([String])
    subjects?:string[]
}
export const TeacherSchema= SchemaFactory.createForClass(Teacher);
