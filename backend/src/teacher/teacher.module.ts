
import { Teacher ,TeacherSchema} from "./entities/teacher.schema"; 
import { User ,UserSchema} from "src/user/entities/user.schema"; 
import { TeacherService } from "./service/teacher.service"; 
import { TeacherController } from "./controllers/teacher.controller";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module"; 
import { TeacherRepository } from "./repositories/teacher.repository"; 
import { UserModule } from "src/user/user.module";
import { MailerModule } from "src/mailer/mailer.module";

@Module({
    imports:[
        MongooseModule.forFeature([
            {name:Teacher.name,schema:TeacherSchema},
            {name:User.name,schema:UserSchema}
        ]),
        AuthModule,
        UserModule,
        MailerModule,
    ],
    controllers:[TeacherController],

    providers:[TeacherService,{provide:"ITeacherRepository",useClass:TeacherRepository}],

    exports:[TeacherService,"ITeacherRepository"]
})

export class TeacherModule{}
