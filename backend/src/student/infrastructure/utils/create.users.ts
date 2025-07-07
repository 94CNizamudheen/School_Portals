import { User } from '../../../auth/domine/user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ForbiddenException } from '@nestjs/common';

export async function createUsers(
  userModel: Model<User>,
  studentEmail: string,
  parentEmail: string,
  studentId: Types.ObjectId,
  parentId: Types.ObjectId
): Promise<{ password: string }> {
  // Check if student user already exists
  const existingStudentUser = await userModel.findOne({ email: studentEmail });
  if (existingStudentUser) {
    throw new ForbiddenException(`Student user with email ${studentEmail} already exists`);
  }

  // Check if parent user already exists
  const existingParentUser = await userModel.findOne({ email: parentEmail });

  // Generate password only for new users
  const randomPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(randomPassword, 10);

  // Create new student user
  const studentUser = new userModel({
    email: studentEmail,
    password: hashedPassword,
    role: 'STUDENT',
    profileId: studentId,
  });

  const saveOps = [studentUser.save()];

  // Only create parent user if not already exists
  
  if (!existingParentUser) {
    const parentUser = new userModel({
      email: parentEmail,
      password: hashedPassword,
      role: 'PARENT',
      profileId: parentId,
    });
    saveOps.push(parentUser.save());
  }

  await Promise.all(saveOps);

  return { password: randomPassword };
}
