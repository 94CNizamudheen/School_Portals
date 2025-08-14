import { Types } from "mongoose";
import { ClassDivisionType } from "./division.type.interface";
import { CreateClassDivisionDto } from "src/class_division/dtos/create.division.dto";
import { UpdateClassDivisionDto } from "src/class_division/dtos/update.division.dto";
import { AddOrRemoveStudentDto, } from "src/class_division/dtos/addOrRemove.student.dto";


export interface IClassDivisionRepository {
    findAll(): Promise<ClassDivisionType[]>;
    getById(id:string):Promise<ClassDivisionType|null>;
    createDivision(data:CreateClassDivisionDto):Promise<ClassDivisionType>;
    update(id:string,data:UpdateClassDivisionDto):Promise<ClassDivisionType|null>;
    delete(id:string):Promise<ClassDivisionType|null>;
    assignStudents(id:string,studentId:AddOrRemoveStudentDto):Promise<ClassDivisionType>;
    removeStudent(id:string,studentid:AddOrRemoveStudentDto):Promise<ClassDivisionType>;
}