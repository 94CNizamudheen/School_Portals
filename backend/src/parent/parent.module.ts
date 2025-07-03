
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Parent,ParentSchema } from "./domine/parent.schema";
import { User,UserSchema } from "src/auth/domine/user.schema";
import { Student,StudentSchema } from "src/student/domine/student.schema";
import { AuthModule } from "src/auth/auth.module";
import { ParentController } from "./infrastructure/parent.controller";
import { ParentService } from "./application/parent.service";

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
    providers:[ParentService],
    exports:[ParentService]
})
export class ParentModule{}
