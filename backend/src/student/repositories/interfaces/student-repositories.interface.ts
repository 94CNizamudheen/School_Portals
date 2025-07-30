
import { CreateStudentDto } from 'src/student/dtos/create-student.dto';
import { Student } from '../../entities/student.schema';
import { UpdateStudentDto } from 'src/student/dtos/update-student.dto';

export interface IStudentRepository {
  createStudent(data: CreateStudentDto): Promise<Student>;
  findAll(): Promise<Student[]>;
  findById(id: string): Promise<Student | null>;
  updateStudent(id: string, data: UpdateStudentDto): Promise<Student | null>;
  deleteStudent(id: string): Promise<void>;
  saveStudent(student:Student):Promise<Student>
}