import {NotFoundException,ForbiddenException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthService } from "src/auth/application/auth.service";
import { Teacher } from "../domain/teacher.schema";
import { CreateTeacherDto,UpdateTeacherDto } from "../infrastruture/dto/teacher.dto";
import { User } from "src/auth/domain/user.schema";
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
    };

    async findAll():Promise<Teacher[]>{
        return this.teacherModel.find().exec()
    };
    async findOne(id:string):Promise<Teacher>{
        const teacher= await this.teacherModel.findById(id).exec()
        if(!teacher) throw new NotFoundException("Teacher Not found");
        return teacher;
    }

    async update(id:string,update_dto:UpdateTeacherDto):Promise  <Teacher|null>{
        const teacher = await this.teacherModel.findById(id).exec();
        if(!teacher) throw new NotFoundException('Teacher not Found');

        if(update_dto.email){
            const existingTeacher= await this.teacherModel.findOne({email:update_dto.email});
            if(existingTeacher && (existingTeacher?._id as string).toString()!==id) throw new ForbiddenException("Email already exists");

            const user= await this.userModel.findOne({profileId:id});
            if(user){
                user.email= update_dto.email;
                await user.save();
            }
         
        }  
         return this.teacherModel.findByIdAndUpdate(id,update_dto,{new:true}).exec();
    }
    async delete(id:string):Promise<void>{
        const teacher= await this.teacherModel.findById(id).exec();
        if(!teacher) throw new NotFoundException("Teacher not found");
        await this.teacherModel.deleteOne({id:id}).exec();
        await this.userModel.deleteOne({profileId:id}).exec();
    }

}


