import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "src/auth/services/auth.service";
import { UserService } from "../services/user.service";


@Controller('user')
@UseGuards(AuthGuard('jwt'))

export class UserControllers{
    constructor(
        private readonly userService:UserService,
    ) {}
      @Get(":id")
      async fetchUser(@Param('id') id: string) {
        return await this.userService.fetchUser(id)
      }
}