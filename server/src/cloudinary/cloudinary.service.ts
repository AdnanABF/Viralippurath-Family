import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
const toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {}

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'general',
    // Added resourceType parameter to handle different file kinds
    resourceType: 'auto' | 'image' | 'video' | 'raw' = 'auto',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const prefix =
      this.configService.get<string>('CLOUDINARY_FOLDER_PREFIX') || 'app';

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: `${prefix}/${folder}`,
          resource_type: resourceType,
          // This ensures the filename is somewhat preserved in Cloudinary
          public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
        },
        (error, result) => {
          if (error) return reject(error);

          if (!result) {
            return reject(
              new BadRequestException(
                'Cloudinary upload failed: No result returned',
              ),
            );
          }

          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteFile(
    publicId: string,
    resourceType: string = 'image',
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      // For PDFs/Raw files, Cloudinary sometimes needs the resource_type specified to delete
      cloudinary.uploader.destroy(
        publicId,
        { resource_type: resourceType },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
    });
  }
}
