import { UpdateParentDto, CreateParentDto } from "../infrastructure/dto/parent.dto";
import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Parent } from "../domain/parent.schema";
import { User } from "src/auth/domain/user.schema";
import { Student } from "src/student/domain/student.schema";
import { Model, Types } from "mongoose";
import * as bcrypt from 'bcrypt';
import { AuthService } from "src/auth/application/auth.service";

@Injectable()
export class ParentService {
    constructor(
        @InjectModel(Parent.name) private parentModel: Model<Parent>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Student.name) private studentModel: Model<Student>,
        private authService: AuthService
    ) {}

    async create(createDto: CreateParentDto): Promise<Parent> {
        try {
            const ex_parent = await this.parentModel.findOne({ email: createDto.email });
            if (ex_parent) throw new ForbiddenException("Parent with this email already exists");

            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            const newParent = new this.parentModel(createDto);
            const savedParent = await newParent.save();

            if (createDto.studentIds) {
                for (const studentId of createDto.studentIds) {
                    const student = await this.studentModel.findById(studentId).exec();

                    if (!student) throw new NotFoundException('Student not found');
                    if (!student.parentIds) student.parentIds = [];
                    if (!student.parentIds.some((p_id) => p_id.toString() === savedParent?._id?.toString())) {
                        student.parentIds.push(savedParent._id as Types.ObjectId);
                        await student.save();
                    }
                }
            }

            const user = new this.userModel({
                email: createDto.email,
                password: hashedPassword,
                role: "PARENT",
                profileId: savedParent._id
            });
            await user.save();

            console.log(`Parent created: ${savedParent.email}, Password: ${randomPassword}`);
            return savedParent;
        } catch (error) {
            throw new InternalServerErrorException('Failed to create parent');
        }
    }

    async findAll(): Promise<Parent[]> {
        try {
            return await this.parentModel.find().exec();
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve parents');
        }
    }

    async findOne(id: string): Promise<Parent> {
        try {
            const parent = await this.parentModel.findById(id).exec();
            if (!parent) throw new NotFoundException("Parent not Found");
            return parent;
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve parent');
        }
    }
    async update(id: string, update_dto: UpdateParentDto): Promise<Parent | null> {
        try {
            const parent = await this.parentModel.findById(id).exec();
            if (!parent) throw new NotFoundException("Parent Not Found");

            if (update_dto.email) {
                const ex_parent = await this.parentModel.findOne({ email: update_dto.email });
                if (ex_parent && (ex_parent._id as string).toString() !== id) {
                    throw new ForbiddenException("Email already exists");
                }
            }
            const user = await this.userModel.findOne({ profileId: id });

            if (user && update_dto.email) {
                user.email = update_dto.email;
                await user.save();
            }
            if (update_dto.studentIds) {
                for (const studentId of update_dto.studentIds) {
                    const student = await this.studentModel.findById(studentId).exec();
                    if (!student) throw new NotFoundException("Student not found");
                    if (!student.parentIds) student.parentIds = [];
                    if (!student.parentIds.some((p_id) => p_id.toString() === id)) {
                        student.parentIds.push(new Types.ObjectId(id));
                        await student.save();
                    }
                }
            }

            return await this.parentModel.findByIdAndUpdate(id, update_dto, { new: true }).populate('studentIds').exec();
        } catch (error) {
            throw new InternalServerErrorException('Failed to update parent');
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const parent = await this.parentModel.findById(id).exec();
            if (!parent) throw new NotFoundException("Parent Not Found");

            if (parent.studentIds) {
                for (let studentId of parent.studentIds) {
                    let student = await this.studentModel.findById(studentId).exec();
                    if (student && student.parentIds) {
                        student.parentIds = student.parentIds.filter((p_id) => p_id.toString() !== id);
                        await student.save();
                    }
                }
            }

            await this.userModel.deleteOne({ profileId: id }).exec();
            await this.parentModel.deleteOne({ _id: id }).exec();
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete parent');
        }
    }
}
