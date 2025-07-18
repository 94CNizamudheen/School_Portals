
import { Student } from '../../entities/student.schema';

export interface IStudentRepository {
  createStudent(data: Partial<Student>): Promise<Student>;
  findAll(): Promise<Student[]>;
  findById(id: string): Promise<Student | null>;
  updateStudent(id: string, data: Partial<Student>): Promise<Student | null>;
  deleteStudent(id: string): Promise<void>;
}