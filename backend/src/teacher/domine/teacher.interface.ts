

import { Document } from "mongoose";

export interface Teacher extends Document{
    name:string;
    email:string;
    mobileNumber:string;
    dob?:string;
    qualification?:string;
    experienceYears?:number;
    subjects?:string[]
};
