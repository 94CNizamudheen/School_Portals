import { User } from '../../../auth/domine/user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export async function createUsers(
  userModel: Model<User>,
  studentEmail: string,
  parentEmail: string,
  studentId: Types.ObjectId,
  parentId: Types.ObjectId
): Promise<{ password: string }> {
  const randomPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(randomPassword, 10);

  const studentUser = new userModel({
    email: studentEmail,
    password: hashedPassword,
    role: 'STUDENT',
    profileId: studentId,
  });

  const parentUser = new userModel({
    email: parentEmail,
    password: hashedPassword,
    role: 'PARENT',
    profileId: parentId,
  });

  await Promise.all([studentUser.save(), parentUser.save()]);

  return { password: randomPassword };
}
