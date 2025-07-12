

  import { ForbiddenException } from '@nestjs/common';
  import { v2 as cloudinary } from 'cloudinary';

  export async function uploadImage(file: Express.Multer.File): Promise<string> {
    if (file.size > 5 * 1024 * 1024) {
      throw new ForbiddenException('FileSize exceed 5MB');
    }

    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
      throw new ForbiddenException('Only JPEG and PNG images are allowed');
    }

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'student_profiles', resource_type: 'image' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    return uploadResult.secure_url;
  }
