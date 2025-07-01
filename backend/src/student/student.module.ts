
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StudentService } from "./application/student.service";
import { StudentController } from "./infrastructure/student.controller";
import { Student,StudentSchema } from "./domine/student.schema";
import { AuthModule } from "src/auth/auth.module";
import {User, UserSchema } from "src/auth/domine/user.schema";


@Module({
    imports:[
        MongooseModule.forFeature([
            {name:Student.name,schema:StudentSchema},
            {name:User.name,schema:UserSchema}
        ]),
        AuthModule
    ],
    controllers:[StudentController],
    providers:[StudentService],
    exports:[StudentService]
})
export class StudentModule{}