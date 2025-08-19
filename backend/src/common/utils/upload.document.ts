
import { ForbiddenException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

export async function uploadDocument(
  file: Express.Multer.File,
): Promise<string> {
  // limit size, allow PDF + images
  if (file.size > 10 * 1024 * 1024) {
    throw new ForbiddenException('File size exceeds 10MB');
  }

  const allowed = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
  ];
  if (!allowed.includes(file.mimetype)) {
    throw new ForbiddenException(
      'Only PDF, JPEG and PNG files are allowed',
    );
  }

  const uploadResult = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'student_documents',
        resource_type:
          file.mimetype === 'application/pdf' ? 'raw' : 'image',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    uploadStream.end(file.buffer);
  });

  return uploadResult.secure_url;
}
