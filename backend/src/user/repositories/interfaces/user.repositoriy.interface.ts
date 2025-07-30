import { CreateUserDto } from "src/user/dto/create.user.dto";
import { User } from "src/user/entities/user.schema";


export interface IUserRepository {
    findUserByEmail(email: string): Promise<User | null>;
    findUserById(id: string): Promise<User | null>;
    createUser(dto:CreateUserDto): Promise<User>;
    saveUser(user:User):Promise<User>

}