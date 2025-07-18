
import { CreateParentDto, } from '../../dtos/create-parent.dto';
import { UpdateParentDto } from 'src/parent/dtos/update-parent.dto';
import { Parent } from '../../entities/parent.schema';
import { DeleteResult, Types } from 'mongoose';
import { User } from 'src/auth/entities/user.schema';

export interface IParentRepository {
  findByEmail(email: string): Promise<Parent | null>;
  createParent(dto: CreateParentDto): Promise<Parent>;
  createUser(email: string, password: string, parentId: string): Promise<User>;
  findAllParents(): Promise<Parent[]>;
  findParentById(id: string): Promise<Parent | null>;
  updateParent(id: string, dto: UpdateParentDto): Promise<Parent | null>;
  updateUserEmail(profileId: string, newEmail: string): Promise<User|null>;
  addParentToStudent(studentId: string, parentId: string): Promise<any>;
  removeParentFromAllStudents(parentId: string, studentIds: (string | Types.ObjectId)[]): Promise<void>;
  deleteParent(id: string): Promise<DeleteResult>;
  findChildrens(ids: Types.ObjectId[]): Promise<any[]>;
}
