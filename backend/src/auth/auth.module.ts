
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService,ConfigModule } from "@nestjs/config";
import { AuthController } from "./infrastrucure/auth.controller";
import { AuthService } from "./application/auth.service";
import { Otp,OtpSchema } from "./domine/otp.schema";
import { User,UserSchema } from "./domine/user.schema";

import { JwtModule } from "@nestjs/jwt";
