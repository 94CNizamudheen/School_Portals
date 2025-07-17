

import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema()
export class Teacher extends Document{
    @Prop({required:true})
    firstName:string;

    @Prop({required:true})
    lastName:string;

    @Prop({required:true,unique:true})
    email:string;

    @Prop({required:true,unique:true})
    mobileNumber:string;

    

    @Prop({required:true})
    profileImage:string

    @Prop({required:true})
    dob:Date

    @Prop({required:true})
    degree:string;

    @Prop({required:true})
    university:string

    @Prop({required:true})
    experienceYears:number;

    @Prop([String])
    subjects?:string[]

}
export const TeacherSchema= SchemaFactory.createForClass(Teacher);
