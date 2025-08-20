import { IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from "class-validator"
import { Types } from "mongoose";



const subjectEnums= ['Core','Language','Elective']

export class UpdateSubjectDto{
    @IsOptional() @IsString() name?:string;
    @IsOptional() @IsEnum(subjectEnums) subjectType?:string;
    @IsOptional() @IsNumber() totalMark?:number
    @IsOptional() @IsNumber() passMark?:number;
    @IsOptional() @IsMongoId({each:true}) assignedTeachers?:Types.ObjectId[] 
}