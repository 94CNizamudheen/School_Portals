

import { ForbiddenException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Student } from '../../domain/student.schema';
import { Parent } from '../../../parent/domain/parent.schema';

export async function validateUniqueness(
  studentModel: Model<Student>,
  parentModel: Model<Parent>,
  studentEmail: string,
  studentMobile: string,
  parentEmail: string,
  parentMobile: string
): Promise<Parent | null> {
  const existingStudent = await studentModel.findOne({
    $or: [{ email: studentEmail }, { mobileNumber: studentMobile }],
  });
  if (existingStudent) throw new ForbiddenException('Student already exists');

  const existingParent = await parentModel.findOne({
    $or: [{ email: parentEmail }, { mobileNumber: parentMobile }],
  });

  return existingParent;
}
