import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './services/auth.service'; 
import { AuthController } from './controllers/auth.controller'; 
import { AuthRepository } from './repositories/auth.repository';
import { IAuthRepository } from './repositories/interfaces/auth-repository.interface';
import { User, UserSchema } from './entities/user.schema';
import { Otp, OtpSchema } from './entities/otp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'IAuthRepository',
      useClass: AuthRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
