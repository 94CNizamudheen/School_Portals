import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ClassDivision, ClassDivisionSchema } from "./entitie/classDivision.schema";
import { ClassDivisionController } from "./controllers/division.controller";
import { ClassDivisionRepository } from "./repositories/division.repository";
import { ClassDivisionService } from "./services/division.service";
import { StudentModule } from "src/student/student.module";
import { AuthModule } from "src/auth/auth.module";


@Module({
    imports:[
        MongooseModule.forFeature([{name:ClassDivision.name,schema:ClassDivisionSchema}]),
        StudentModule,
        AuthModule
    ],
    controllers:[ClassDivisionController,],
    providers:[ClassDivisionService,{provide:"IClassDivisionRepository",useClass:ClassDivisionRepository}],
    exports:["IClassDivisionRepository",ClassDivisionService]
})

export class ClassDivisionModule{}