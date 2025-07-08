import { Document,Types } from "mongoose";

export interface Student extends Document{
    name:string;
    email:string;
    mobileNumber:string;
    parantName?:string;
    address?:string;
    dob?:Date;
    bloodGroup?:string;
    grade?:string;
    enrollmentDate?:Date;
    parantIds?:Types.ObjectId;
}