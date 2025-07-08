


import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService,ConfigModule } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "../application/auth.service";
import { Otp,OtpSchema } from "../domain/otp.schema";
import { User,UserSchema } from "../domain/user.schema";
import { AuthRepository } from "../domain/auth.repository";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { RoleGuard } from "./roles.guard";

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
    providers:[AuthService,JwtStrategy,RoleGuard,AuthRepository],
    exports:[AuthService]
})
export class AuthModule{}

