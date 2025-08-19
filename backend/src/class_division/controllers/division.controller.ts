import { Body, Controller, Delete, Get, Inject, Logger, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ClassDivisionService } from "../services/division.service";
import { CreateClassDivisionDto } from "../dtos/create.division.dto";
import { UpdateClassDivisionDto } from "../dtos/update.division.dto";
import { AddOrRemoveStudentDto } from "../dtos/addOrRemove.student.dto";




@Controller('divisions')
@UseGuards(AuthGuard('jwt'))
export class ClassDivisionController{
    private readonly logger= new Logger(Controller.name)
    constructor(@Inject() private readonly classDivisionService:ClassDivisionService ){}

    @Get()
    async findAll(){
        return await this.classDivisionService.findAll()
    };

    @Get(':id')
    async findByid(@Param('id')id:string){
        return await this.classDivisionService.findById(id)
    };

    @Post()
    async create(@Body()data: CreateClassDivisionDto) {
        this.logger.debug(data)
        return await this.classDivisionService.createDivision(data)
    };

    @Patch(':id')
    async update(@Param('id')id:string, @Body()data:UpdateClassDivisionDto){
        this.logger.debug(data)
        return await this.classDivisionService.updateDivision(id,data);
    };

    @Patch('add-student/:id')
    async addStudent(@Param('id')id:string, @Body()data:AddOrRemoveStudentDto){
        this.logger.debug("data for add student",data)
        return await this.classDivisionService.addStudent(id,data)
    };

    @Patch('remove-student/:id')
    async removeStudent(@Param('id')id:string, @Body()data:AddOrRemoveStudentDto){
        return await this.classDivisionService.removeStudent(id,data)
    };
    
    @Delete(':id')
    async deleteDivision(@Param('id')id:string){
        return this.classDivisionService.deleteDivision(id)
    };

}