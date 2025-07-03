import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { databaseConfig } from "./config/database.config";
import {AuthModule} from './auth/auth.module'
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { AdminModule } from './admin/admin.module';
import { ParentModule } from './parent/parent.module';

@Module({
    imports:[
        ConfigModule.forRoot({isGlobal:true}),
        MongooseModule.forRoot(databaseConfig.uri ?? ""),
        AuthModule,
        StudentModule,
        TeacherModule,
        AdminModule,
        ParentModule
    ],
})
export class AppModule{}

