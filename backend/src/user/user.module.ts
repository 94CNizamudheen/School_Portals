import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./entities/user.schema";
import { AuthModule } from "src/auth/auth.module";
import { UserControllers } from "./controllers/user.controller";
import { UserService } from "./services/user.service";
import { UserRepository } from "./repositories/user.repository";




@Module({
    imports:[
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        forwardRef(()=>AuthModule)
    ],
    controllers:[UserControllers],
    providers:[
        UserService,
        {provide:"IUserRepository",useClass:UserRepository}
    ],
    exports:[UserService,"IUserRepository"]
})

export class UserModule{}