import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { UserService } from "../services/user.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";


@Controller('user')
// @UseGuards(AuthGuard('jwt'))
@UseGuards(JwtAuthGuard)

export class UserControllers{
    constructor(
        private readonly userService:UserService,
    ) {}
      @Get(":id")
      async fetchUser(@Param('id') id: string) {
        return await this.userService.fetchUser(id)
      }
}