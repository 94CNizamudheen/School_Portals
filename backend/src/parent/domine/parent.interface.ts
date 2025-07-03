
import { Document ,Types} from "mongoose";

export interface Parent extends Document{
    name:string;
    email:string;
    mobileNumber:string;
    occupation?:string;
    studentIds?:Types.ObjectId[];
}
