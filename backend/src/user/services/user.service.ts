import { NotFoundException } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";


export class UserService {
    constructor(
        private readonly repo:UserRepository
    ) { }
    async fetchUser(id: string) {
        const user = await this.repo.findUserById(id);
        if (!user) throw new NotFoundException('User not found')
        return user
    }

}