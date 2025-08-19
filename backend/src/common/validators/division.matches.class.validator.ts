
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { CreateClassDivisionDto } from "src/class_division/dtos/create.division.dto";


@ValidatorConstraint({ name: "DivisionMatchesClass", async: false })
export class DivisionMatchesClass implements ValidatorConstraintInterface {
    validate(divisionName: string, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        const dto = validationArguments?.object as CreateClassDivisionDto;
        if (!dto.classLevel || !divisionName) return false;
        const regex = new RegExp(`^${dto.classLevel}-[A-Z]+$`);
        return regex.test(divisionName);
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        const dto = validationArguments?.object as CreateClassDivisionDto;
        return `Division name must start with "${dto.classLevel}-" (e.g. "${dto.classLevel}-A")`;
    }
}