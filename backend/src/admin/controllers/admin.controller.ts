

import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from '../service/admin.services'; 
import { CreateAdminDto} from '../dtos/create-admin.dto';
import { UpdateAdminDto } from '../dtos/update-admin.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator'; 
import { Role } from 'src/auth/dtos/register.dtos'; 

@Controller('admins')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createDto: CreateAdminDto) {
    return this.adminService.create(createDto);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateAdminDto) {
    return this.adminService.update(id, updateDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.adminService.delete(id);
  }
}
