
import { Controller,Get,Post,Put,Delete,Param,Body, UseGuards } from "@nestjs/common";
import { AdminService } from "../application/admin.service";
import { CreateAdminDto,UpdateAdminDto } from "./admin.dto";
import { JwtAuthGuard } from "src/auth/infrastrucure/jwt-auth.guard";
import { Role } from "src/auth/infrastrucure/dto/auth.dto";
import { Roles } from "src/auth/infrastrucure/roles.decorator";
@Controller('admins')
@UseGuards(JwtAuthGuard)
export class AdminController{
    constructor(private readonly adminService:AdminService){};

    @Roles(Role.ADMIN)
    @Post()
    create(@Body()createDto:CreateAdminDto){
        return this.adminService.create(createDto);
    }
    @Roles(Role.ADMIN)
    @Put(':id')
    update(@Param('id')id:string,@Body()updateDto:UpdateAdminDto){
        return this.adminService.update(id,updateDto);
    };

    @Roles(Role.ADMIN)
    @Get()
    findAll(){
        return this.adminService.findAll();
    };

    @Roles(Role.ADMIN)
    @Get(':id')
    findOne(@Param('id')id:string){
        return this.adminService.findOne(id);
    };

    @Roles(Role.ADMIN)
    @Delete(':id')
    delete(@Param('id')id:string){
        return this.adminService.delete(id)
    }

};

