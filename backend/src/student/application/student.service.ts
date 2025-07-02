
import { Injectable, NotFoundException, ForbiddenException, Param, } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthService } from "src/auth/application/auth.service";
import { Student } from "src/student/domine/student.schema";
import { CreateStudentDto, UpdateStudentDto } from "src/student/infrastructure/dto/student.dto";
import { User } from "src/auth/domine/user.schema";
import { Parent } from "../../parent/domine/parent.schema";
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentService {
    constructor(
        @InjectModel(Student.name) private studentModel: Model<Student>,
        @InjectModel(Parent.name) private parantModel: Model<Parent>,
        @InjectModel(User.name) private userModel: Model<User>,
        private authService: AuthService
    ) { }
    async create(createStudentDto: CreateStudentDto): Promise<Student> {
        const existingStudent = await this.studentModel.findOne({ email: createStudentDto.email });
        if (existingStudent) throw new ForbiddenException("Email already exists")

        const randomPassWord= Math.random().toString(36).slice(-8);
        const hashedPassword= await bcrypt.hash(randomPassWord,10);

        const student= new this.studentModel(createStudentDto);
        const savedStudent= await student.save();

        if (createStudentDto.parentIds) {
            for (let parentId of createStudentDto.parentIds) {
                const parent = await this.parantModel.findById(parentId).exec();
                if (!parent) throw new NotFoundException(`parent with ID ${parentId} not found`);
                if (!parent.studentIds) parent.studentIds = [];
                if (!parent.studentIds.some((id) => id.toString() === savedStudent.id.toString())){
                    parent.studentIds.push(savedStudent?.id);
                    await parent.save();
                }
            }
        }
        const user= new this.userModel({
            email:createStudentDto.email,
            password:hashedPassword,
            role:'STUDENT',
            profileId:savedStudent._id
        });
        await user.save();
        console.log(`student created ${savedStudent.email}, password: ${randomPassWord}`);
        return savedStudent;
    };

    async findAll():Promise<Student[]>{
        return this.studentModel.find().populate('parentIds').exec();
    };

    async findOne(id:string):Promise<Student>{
        const student= await this.studentModel.findById(id).exec();
        if(!student) throw new NotFoundException("Student not found");
        return student;
    };

    async update(id:string,updateStudentDto:UpdateStudentDto):Promise<Student|null>{
        const student= await this.studentModel.findById(id).exec();
        if(!student) throw new NotFoundException("student not found");

        if(updateStudentDto.email){
            const existingStudent= await this.studentModel.findOne({email:updateStudentDto.email});
            if(existingStudent && (existingStudent._id as string).toString()!== id){
                throw new ForbiddenException('Email already Exists')
            }
            const user= await this.userModel.findOne({profileId:id});
            if(user){
                user.email= updateStudentDto.email;
                await user.save();
            }
        };
        if(updateStudentDto.parentIds){
            for(const parentId of updateStudentDto.parentIds){
                const parent= await this.parantModel.findById(parentId).exec();
                if(!parent) throw new NotFoundException(`parantId with ${parentId} not found`);
                if(!parent.studentIds) parent.studentIds=[];
                if(!parent.studentIds.some((s_id)=>s_id.toString()===id)){
                    parent.studentIds.push(student.id);
                    await parent.save();
                }
            }
        }
        return this.studentModel.findByIdAndUpdate(id,updateStudentDto,{new:true}).populate('parentIds').exec()
    };

    async delete(id:string):Promise<void>{
        const student= await this.studentModel.findById(id).exec();
        if(!student) throw new NotFoundException("Student not Found");
        if(student.parentIds){
            for(const parentId of student.parentIds){
                const parent= await this.parantModel.findById(parentId).exec();
                if(parent && parent.studentIds){
                    parent.studentIds= parent.studentIds.filter((s_id)=>s_id.toString()!==id)
                    await parent.save();
                }
            }
        }
        await this.userModel.deleteOne({profileId:id}).exec();
        await this.studentModel.deleteOne({_id:id});
    }

}


