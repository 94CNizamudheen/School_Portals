
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from '../application/admin.service';
import { AdminRepository } from '../domain/admin.repository';
import { Admin, AdminSchema } from '../domain/admin.schema';
import { User, UserSchema } from 'src/auth/domain/user.schema';
import { AuthModule } from 'src/auth/infrastrucure/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
  exports: [AdminService],
})
export class AdminModule {}
