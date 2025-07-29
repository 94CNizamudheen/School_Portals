import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { AuthRepository } from './repositories/auth.repository';
import { User, UserSchema } from './entities/user.schema';
import { Otp, OtpSchema } from './entities/otp.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { BlacklistedToken, BlacklistedTokenSchema } from './entities/blacklist.schema';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema },
      {name:BlacklistedToken.name,schema:BlacklistedTokenSchema}
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    {
      provide: 'IAuthRepository',
      useClass: AuthRepository,
    },
    JwtStrategy,
    JwtAuthGuard
  ],
  exports: [AuthService,JwtModule,JwtStrategy,JwtAuthGuard,'IAuthRepository'],
})
export class AuthModule { }
