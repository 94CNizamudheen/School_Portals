
import { Teacher,TeacherSchema } from "./domine/teacher.schema";
import { User,UserSchema } from "src/auth/domine/user.schema";
import { TeacherService } from "./application/teacher.service";
import { TeacherController } from "./infrastruture/teacher.controller";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports:[
        MongooseModule.forFeature([
            {name:Teacher.name,schema:TeacherSchema},
            {name:User.name,schema:UserSchema}
        ]),
        AuthModule,
    ],
    controllers:[TeacherController],
    providers:[TeacherService],
    exports:[TeacherService]
})

export class TeacherModule{}
