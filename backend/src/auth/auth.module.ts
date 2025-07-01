
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService,ConfigModule } from "@nestjs/config";
import { AuthController } from "./infrastrucure/auth.controller";
import { AuthService } from "./application/auth.service";
import { Otp,OtpSchema } from "./domine/otp.schema";
import { User,UserSchema } from "./domine/user.schema";

import { JwtModule } from "@nestjs/jwt";

import { JwtStrategy } from "./infrastrucure/jwt.strategy";
import { RoleGuard } from "./infrastrucure/roles.guard";

@Module({
    imports:[
        MongooseModule.forFeature([
            {name:User.name,schema:UserSchema},
            {name:Otp.name,schema:OtpSchema}
        ]),
        JwtModule.registerAsync({
            imports:[ConfigModule],
            useFactory:async (configService:ConfigService)=>({
                secret:configService.get<string>('JWT_SECRET'),
                signOptions:{expiresIn:configService.get<string>('JWT_EXPIRES_IN')}
            }),
            inject:[ConfigService]
        })
    ],
    controllers:[AuthController],
    providers:[AuthService,JwtStrategy,RoleGuard],
    exports:[AuthService]
})
export class AuthModule{}

