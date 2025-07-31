
import { CreateStudentDto } from 'src/student/dtos/create-student.dto';
import { Student } from '../../entities/student.schema';
import { UpdateStudentDto } from 'src/student/dtos/update-student.dto';
import { AdmissionType } from 'src/admission/repositories/admission.type';

export interface IStudentRepository {
  createStudent(data: CreateStudentDto,admission:AdmissionType): Promise<Student>;
  findAll(): Promise<Student[]>;
  findById(id: string): Promise<Student | null>;
  updateStudent(id: string, data: UpdateStudentDto): Promise<Student | null>;
  deleteStudent(id: string): Promise<void>;
  saveStudent(student:Student):Promise<Student>
} 