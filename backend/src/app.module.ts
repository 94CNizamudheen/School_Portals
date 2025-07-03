import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
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
        MongooseModule.forRootAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory: async(configService:ConfigService)=>({
                uri:configService.get<string>('MONGODB_URI')
            })
        }),
        AuthModule,
        StudentModule,
        TeacherModule,
        AdminModule,
        ParentModule
    ],
})
export class AppModule{}

