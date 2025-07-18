import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Patch } from "@nestjs/common";
import { ParentService } from "../services/parent.service";
import { CreateParentDto } from "../dtos/create-parent.dto";
import { UpdateParentDto } from "../dtos/update-parent.dto";
import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Role } from "src/auth/dtos/register.dtos";


@Controller('parents')
@UseGuards(JwtAuthGuard)
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createParentDto: CreateParentDto) {
    return this.parentService.create(createParentDto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParentDto: UpdateParentDto) {
    return this.parentService.update(id, updateParentDto);
  }

  @Roles(Role.ADMIN, Role.PARENT)
  @Get()
  findAll() {
    return this.parentService.findAll();
  }

  @Roles(Role.ADMIN, Role.PARENT)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parentService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.parentService.delete(id);
  }

  @Roles(Role.ADMIN)
  @Get(":id/children")
  findChildrens(@Param('id') id: string) {
    return this.parentService.findChildrens(id);
  }
}
