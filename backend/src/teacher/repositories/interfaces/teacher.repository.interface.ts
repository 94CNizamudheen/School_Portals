

import { CreateTeacherDto } from "src/teacher/dtos/create-teacher.dto";
import { Teacher } from "src/teacher/entities/teacher.schema"; 

export interface ITeacherRepository{
    apply(data:CreateTeacherDto &{profileImage:string;eligibilityDocuments:string[]}):Promise<Teacher>
    findByEmail(email:string):Promise<Teacher|null>;
    findById(id:string):Promise<Teacher|null>;
    findOneEmailOrMobile(mobileNumber:string,email:string):Promise<Teacher|null>
    findAll():Promise<Teacher[]|null>;
    // createTeacher(data:Partial<Teacher>):Promise<Teacher>;
    updateTeacher(id:string,data:Partial<Teacher>):Promise<Teacher|null>;
    deleteTeacher(id:string):Promise<void>
    saveTeacher(teacher:Teacher):Promise<Teacher>


}