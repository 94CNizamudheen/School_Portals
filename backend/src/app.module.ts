import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { AdminModule } from './admin/admin.module';
import { ParentModule } from './parent/parent.module';
import { v2 as cloudinary } from 'cloudinary';
import { AdmissionModule } from './admission/admission.module';
import { PaymentModule } from './payment/payment.module';
import { UserModule } from './user/user.module';
import { MailerModule } from './mailer/mailer.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ClassDivisionModule } from './class_division/classDivision.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI')
            })
        }),
        ThrottlerModule.forRoot({ throttlers: [{ ttl: 60, limit: 20 }] }),
        AuthModule,
        StudentModule,
        TeacherModule,
        AdminModule,
        ParentModule,
        AdmissionModule,
        PaymentModule,
        UserModule,
        MailerModule,
        ClassDivisionModule
    ],
    providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard, },],
})
export class AppModule {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }
}

