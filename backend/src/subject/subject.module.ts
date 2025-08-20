import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Subject, SubjectSchema } from "./entitie/subject.schema";
import { AuthModule } from "src/auth/auth.module";
import { TeacherModule } from "src/teacher/teacher.module";
import { SubjectController } from "./controllers/subject.controller";
import { SubjectSerivice } from "./service/subject.service";
import { SubjectRepository } from "./repositories/subject.repository";

@Module({
    imports:[
        MongooseModule.forFeature([{name:Subject.name,schema:SubjectSchema}]),
        AuthModule,
        TeacherModule
    ],
    controllers:[SubjectController],
    providers:[SubjectSerivice,{provide:"ISubjectRepository",useClass:SubjectRepository}],
    exports:["ISubjectRepository",SubjectSerivice]
})

export class SubjectModule{}