import { InjectModel } from "@nestjs/mongoose";
import { IUserRepository } from "./interfaces/user.repositoriy.interface";
import { User } from "../entities/user.schema";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from "../dto/create.user.dto";

export class UserRepository implements IUserRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) { }

    async findUserByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }
    async createUser(dto:CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = new this.userModel({name:dto.name, email:dto.email, password: hashedPassword, role:dto.role });
        return user.save();
    }
    async findUserById(id: string): Promise<User | null> {
        return await this.userModel.findById(id);
    }
    async saveUser(user:User):Promise<User>{
        return await user.save()
    }

};
