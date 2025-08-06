

import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Logger } from '@nestjs/common';
import { StudentService } from '../services/student.service';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator'; 
import { Role } from 'src/auth/dtos/register.dtos'; 
import { CreateStudentDto } from '../dtos/create-student.dto';
import { UpdateStudentDto } from '../dtos/update-student.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('students')
@UseGuards(AuthGuard('jwt'))

export class StudentController {
  private readonly logger= new Logger(StudentController.name)
  constructor(private readonly studentService: StudentService) {}

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() studentCreateDto: CreateStudentDto) {
    return this.studentService.create(studentCreateDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    return this.studentService.findAll();
  }

  @Roles(Role.ADMIN, Role.PARENT,Role.STUDENT)
  @Get(':id')
  async findById(@Param('id') id: string) {
        this.logger.debug(id)
    return this.studentService.findById(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {

    return this.studentService.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.studentService.delete(id);
  }
}