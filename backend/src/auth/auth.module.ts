import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { AuthRepository } from './repositories/auth.repository';
import { Otp, OtpSchema } from './entities/otp.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { BlacklistedToken, BlacklistedTokenSchema } from './entities/blacklist.schema';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserModule } from 'src/user/user.module';
import { User, UserSchema } from 'src/user/entities/user.schema';
import { StudentModule } from 'src/student/student.module';
import { ParentModule } from 'src/parent/parent.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Otp.name, schema: OtpSchema },
      { name: User.name, schema: UserSchema },
      {name:BlacklistedToken.name,schema:BlacklistedTokenSchema}
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') }
      }),
      inject: [ConfigService]
    }),
    UserModule,
    StudentModule,
    ParentModule,
    MailerModule
  ],
  controllers: [AuthController],
  providers: [AuthService,AuthRepository,
    {
      provide: 'IAuthRepository',
      useClass: AuthRepository,
    },
    JwtStrategy,
    JwtAuthGuard
  ],
  exports: [AuthService,JwtModule,JwtStrategy,'IAuthRepository',JwtAuthGuard],
})
export class AuthModule { }
