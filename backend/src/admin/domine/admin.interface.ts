
import { Document } from "mongoose";

export interface Admin extends Document{
    name:string;
    email:string;
    mobileNumber:string;
    isAdmin:boolean;
};
