import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";


const subjectEnums= ['Core','Language','Elective']
export class CreateSubjectDto{
    @IsString() name:string;
    @IsOptional() @IsEnum(subjectEnums) subjectType?:string
    @IsOptional() @IsNumber() totalMark?:number
    @IsOptional() @IsNumber() passMark?:number
};
