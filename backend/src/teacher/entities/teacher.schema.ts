

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Address } from "src/utils/address";


@Schema({timestamps:true})
export class Teacher extends Document {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, unique: true })
    mobileNumber: string;

    @Prop({ required: false })
    profileImage: string

    @Prop({ required: true })
    dob: Date

    @Prop({ required: true, type: Address })
    address: Address;

    @Prop({ required: true })
    qualification: string;

    @Prop({ required: true })
    university: string

    @Prop({ required: true })
    experience: string;

    @Prop({ required: true })
    KTET_CTET_certificateNo: string

    @Prop({ required: true })
    subject: string

    @Prop({type:[String],default:[]})
    eligibilityDocuments:string

    @Prop({default:'pending',enum:['pending','approved','rejected']})status:string;

    @Prop({ required: false }) experienceStartDate?: Date

}
export const TeacherSchema = SchemaFactory.createForClass(Teacher);
