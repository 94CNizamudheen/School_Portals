
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StudentService } from "./application/student.service";
import { StudentController } from "./infrastructure/student.controller";
import { Student,StudentSchema } from "./domine/student.schema";
import { AuthModule } from "src/auth/auth.module";
import {User, UserSchema } from "src/auth/domine/user.schema";
import { ParentModule } from "src/parent/parent.module";
import { VerificationToken, VerificationTokenSchema } from "./domine/verification.token.schema";
import { ConfigModule } from "@nestjs/config";
import { Parent, ParentSchema } from "src/parent/domine/parent.schema";




@Module({
    imports:[
        MongooseModule.forFeature([
            {name:Student.name,schema:StudentSchema},
            {name:User.name,schema:UserSchema},
            {name:Parent.name,schema:ParentSchema},
            {name:VerificationToken.name,schema:VerificationTokenSchema}
        ]),
        AuthModule,
        ParentModule
    ],
    controllers:[StudentController],
    providers:[StudentService],
    exports:[StudentService]
})
export class StudentModule{}