
import { IsArray, IsNotEmpty, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateClassDivisionDto {
    @IsString() @IsNotEmpty() divisionName: string;

    @IsArray() @IsString({ each: true })  subjects: string[];

    @IsMongoId() classTeacherId: string;

    @IsString() classLevel:string
}
