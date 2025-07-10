
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Parent,ParentSchema } from "../domain/parent.schema";
import { User,UserSchema } from "src/auth/domain/user.schema";
import { Student,StudentSchema } from "src/student/domain/student.schema";
import { AuthModule } from "src/auth/infrastrucure/auth.module";
import { ParentController } from "./parent.controller";
import { ParentService } from "../application/parent.service";
import { ParentRepository } from "../domain/parent.repository";

@Module({
    imports:[
        MongooseModule.forFeature([
            {name:User.name,schema:UserSchema},
            {name:Student.name,schema:StudentSchema},
            {name:Parent.name,schema:ParentSchema},
        ]),
        AuthModule
    ],
    controllers:[ParentController],
    providers:[ParentService,ParentRepository],
    exports:[ParentService,MongooseModule,ParentRepository]
})
export class ParentModule{}
