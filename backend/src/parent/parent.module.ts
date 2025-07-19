import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Parent, ParentSchema } from "./entities/parent.schema";
import { User ,UserSchema} from "src/auth/entities/user.schema"; 
import { Student,StudentSchema } from "src/student/entities/student.schema"; 
import { AuthModule } from "src/auth/auth.module"; 

import { ParentController } from "./controllers/parent.controller";
import { ParentService } from "./services/parent.service";
import { ParentRepository } from "./repositories/parent.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Parent.name, schema: ParentSchema },
    ]),
    AuthModule,
  ],
  controllers: [ParentController],
  providers: [ParentService, ParentRepository],
  exports: [ParentService],
})
export class ParentModule {}
