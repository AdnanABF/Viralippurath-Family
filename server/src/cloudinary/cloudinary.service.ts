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
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const prefix =
      this.configService.get<string>('CLOUDINARY_FOLDER_PREFIX') || 'app';

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: `${prefix}/${folder}`,
          resource_type: 'auto',
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

  async deleteFile(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
