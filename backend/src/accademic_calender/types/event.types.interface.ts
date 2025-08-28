import { Types } from "mongoose";


export interface SchoolEventType{
    _id:Types.ObjectId;
    title:string;
    description:string;
    date:Date;
    endDate:Date;
    venue:string;
    posterUrl:string;
    createdAt?:Date;
    updatedAt?:Date;
}