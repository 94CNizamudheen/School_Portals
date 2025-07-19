

import { Teacher } from "src/teacher/entities/teacher.schema"; 

export interface ITeacherRepository{
    findByEmail(email:string):Promise<Teacher|null>;
    findById(id:string):Promise<Teacher|null>;
    findAll():Promise<Teacher[]|null>;
    createTeacher(data:Partial<Teacher>):Promise<Teacher>;
    updateTeacher(id:string,data:Partial<Teacher>):Promise<Teacher|null>;
    deleteTeacher(id:string):Promise<void>


}