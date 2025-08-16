
import { IsArray, IsNotEmpty, IsMongoId, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateClassDivisionDto {
    @IsString() @IsNotEmpty() divisionName: string;

    @IsArray() @IsString({ each: true })  subjects: string[];

    @IsMongoId() classTeacherId: string;

    @IsString() classLevel:string;
    
    @IsNumber() capacity:number
}
