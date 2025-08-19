
import { IsArray, IsNotEmpty, IsMongoId, IsString, IsNumber, Validate, Matches } from 'class-validator';
import { DivisionMatchesClass } from 'src/common/validators/division.matches.class.validator';

export class CreateClassDivisionDto {
    @IsString() @IsNotEmpty() @Validate(DivisionMatchesClass) divisionName: string;

    @IsArray() @IsString({ each: true }) subjects: string[];

    @IsMongoId() classTeacherId: string;

    @IsString()
    @Matches(/^(LKG|UKG|[1-7])$/, {
        message: 'classLevel must be LKG, UKG, or 1–7',
    })
    classLevel: string;

    @IsNumber() capacity: number
}
