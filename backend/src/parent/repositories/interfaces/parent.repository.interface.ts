
import { CreateParentDto, } from '../../dtos/create-parent.dto';
import { UpdateParentDto } from 'src/parent/dtos/update-parent.dto';
import { Parent } from '../../entities/parent.schema';
import { DeleteResult, Types } from 'mongoose';

export interface IParentRepository {
  findByEmail(email: string): Promise<Parent | null>;
  createParent(dto: CreateParentDto): Promise<Parent>;
  findAllParents(): Promise<Parent[]>;
  findParentById(id: string): Promise<Parent | null>;
  updateParent(id: string, dto: UpdateParentDto): Promise<Parent | null>;
  addParentToStudent(studentId: string, parentId: string): Promise<any>;
  // removeParentFromAllStudents(parentId: string, studentIds: (string | Types.ObjectId)[]): Promise<void>;
  deleteParent(id: string): Promise<DeleteResult>;
  findChildrens(ids: Types.ObjectId[]): Promise<any[]>;
  pushStudentIds(parentId:string,studentIds:string[]):Promise<Parent>;
}
