
import { Controller,Get,Post,Put,Delete,Param,Body, UseGuards,  } from "@nestjs/common";
import { ParentService } from "../application/parent.service";
import { JwtAuthGuard } from "src/auth/infrastrucure/jwt-auth.guard";
import { Role } from "src/auth/infrastrucure/dto/auth.dto";
import { Roles } from "src/auth/infrastrucure/roles.decorator";
import { CreateParentDto,UpdateParentDto } from "./dto/parent.dto";



@Controller('parents')
@UseGuards(JwtAuthGuard)

export class ParentController{
    constructor(private readonly parentService:ParentService){};

    @Roles(Role.ADMIN)
    @Post()
    create(@Body()createParentDto:CreateParentDto){
        return this.parentService.create(createParentDto);
    };

    @Roles(Role.ADMIN)
    @Put(':id')
    update(@Param('id')id:string,@Body() updateParentDto:UpdateParentDto){
        return this.parentService.update(id,updateParentDto);
    };

    @Roles(Role.ADMIN,Role.PARENT)
    @Get()
    findAll(){
        return this.parentService.findAll();
    };

    @Roles(Role.ADMIN,Role.PARENT)
    @Get(':id')
    findOne(@Param('id')id:string){
        return this.parentService.findOne(id);
    };

    @Roles(Role.ADMIN)
    @Delete(':id')
    delete(@Param('id')id:string){
        return this.parentService.delete(id);
    }
    @Roles(Role.ADMIN)
    @Get(":id/children")
    findChildrens(@Param('id')id:string){
        return this.parentService.findChildrens(id)
    }
}