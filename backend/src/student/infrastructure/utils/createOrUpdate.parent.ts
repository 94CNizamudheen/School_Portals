import { Parent } from '../../../parent/domine/parent.schema';
import { Model, Types } from 'mongoose';

export async function createOrUpdateParent(
  parentModel: Model<Parent>,
  parentData: any,
  studentId: Types.ObjectId,
  existingParent?: Parent|null
) {
  let parent = existingParent;

  if (!parent) {
    parent = new parentModel({ ...parentData, studentIds: [studentId] });
  } else {
    parent.studentIds = [...(parent.studentIds || []), studentId];
  }

  await parent.save();
  return parent;
}
