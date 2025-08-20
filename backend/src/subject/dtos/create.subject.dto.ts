import { IsEnum, IsOptional, IsString } from "class-validator";


const subjectEnums= ['Core','Language','Elective']
export class CreateSubjectDto{
    @IsString() name:string;
    @IsOptional() @IsEnum(subjectEnums) subjectType?:string
}