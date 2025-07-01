import {NotFoundException,ForbiddenException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthService } from "src/auth/application/auth.service";
import { Teacher } from "../domine/teacher.schema";
import { CreateTeacherDto,UpdateTeacherDto } from "../infrastruture/dto/teacher.dto";
import { User } from "src/auth/domine/user.schema";
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeacherService{
    constructor(
        @InjectModel(Teacher.name) private teacherModel:Model<Teacher>,
        @InjectModel(User.name) private userModel:Model<User>,
        private authService:AuthService
    ){};
    async create(create_dto:CreateTeacherDto):Promise<Teacher>{
        const existingTeacher= await this.teacherModel.findOne({email:create_dto.email});
        if(existingTeacher) throw new ForbiddenException("Teacher with this email already exists");

        const randomPassWord= Math.random().toString(36).slice(-8)
        const hashedPassword= await bcrypt.hash(randomPassWord,10);

        const teacher= new this.teacherModel(create_dto);
        const savedTeacher= await teacher.save();


        const user= new this.userModel({
            name:create_dto.name,
            password:hashedPassword,
            role:'TEACHER',
            profileId:savedTeacher._id
        })
        await user.save();
        console.log(`Teacher created: ${savedTeacher.email}, Password: ${randomPassWord}`);
        return savedTeacher;
    }

}


