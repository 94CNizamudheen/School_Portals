import { IsArray, IsMongoId, IsOptional, IsString } from "class-validator";


export class UpdateClassDivisionDto{
    @IsOptional() @IsMongoId() classTeacherId?: string;
    @IsOptional() @IsArray() @IsMongoId({ each: true }) assignedStudents?: string[];
    @IsOptional() @IsArray()  subjects?: string[];
    @IsOptional() @IsString() classLevel?:string
}