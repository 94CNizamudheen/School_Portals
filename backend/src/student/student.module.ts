
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StudentService } from "./application/student.service";
import { StudentController } from "./infrastructure/student.controller";
import { Student,StudentSchema } from "./domain/student.schema";
import { AuthModule } from "src/auth/auth.module";
import {User, UserSchema } from "src/auth/domain/user.schema";
import { ParentModule } from "src/parent/parent.module";
import { Otp,OtpSchema } from "src/auth/domain/otp.schema";
import { Parent, ParentSchema } from "src/parent/domain/parent.schema";


@Module({
    imports:[
        MongooseModule.forFeature([
            {name:Student.name,schema:StudentSchema},
            {name:User.name,schema:UserSchema},
            {name:Parent.name,schema:ParentSchema},
            {name:Otp.name,schema:OtpSchema}
        ]),
        AuthModule,
        ParentModule
    ],
    controllers:[StudentController],
    providers:[StudentService],
    exports:[StudentService]
})
export class StudentModule{}