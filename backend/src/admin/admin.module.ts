
import { AdminService } from "./application/admin.service";
import { AdminController } from "./infrastrucure/admin.controller";
import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { User,UserSchema } from "src/auth/domine/user.schema";
import { AdminSchema,Admin } from "./domine/admin.schema";
import { TeacherModule } from "src/teacher/teacher.module";
import { StudentModule } from "src/student/student.module";
import { ParentModule } from "src/parent/parent.module";
import { MongooseModule } from "@nestjs/mongoose";


@Module({
    imports:[
        MongooseModule.forFeature([
            {name:User.name,schema:UserSchema},
            {name:Admin.name,schema:AdminSchema},
        ]),
        AuthModule,
        StudentModule,
        ParentModule,
        TeacherModule
    ],
    controllers:[AdminController],
    providers:[AdminService],
    exports:[AdminService],
})
export class AdminModule{}
