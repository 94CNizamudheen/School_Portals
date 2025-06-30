import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { databaseConfig } from "./config/database.config";
import {AuthModule} from './auth/auth.module'

@Module({
    imports:[
        ConfigModule.forRoot({isGlobal:true}),
        MongooseModule.forRoot(databaseConfig.uri ?? ""),
        AuthModule,
    ],
})
export class AppModule{}

