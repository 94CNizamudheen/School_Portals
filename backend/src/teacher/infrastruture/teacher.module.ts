
import { Teacher,TeacherSchema } from "../domain/teacher.schema";
import { User,UserSchema } from "src/auth/domain/user.schema";
import { TeacherService } from "../application/teacher.service";
import { TeacherController } from "./teacher.controller";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/infrastrucure/auth.module";
import { TeacherRepository } from "../domain/teacher.repository";

@Module({
    imports:[
        MongooseModule.forFeature([
            {name:Teacher.name,schema:TeacherSchema},
            {name:User.name,schema:UserSchema}
        ]),
        AuthModule,
    ],
    controllers:[TeacherController],
    providers:[TeacherService,TeacherRepository],
    exports:[TeacherService,TeacherRepository]
})

export class TeacherModule{}
