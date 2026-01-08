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

  /**
   * Generates a signature for secure client-side uploads.
   * Returns standardized format as this is often a direct API call.
   */
  async generateSignature(folder: string = 'general') {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const prefix =
      this.configService.get<string>('CLOUDINARY_FOLDER_PREFIX') || 'app';
    const folderPath = `${prefix}/${folder}`;

    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!apiSecret) {
      throw new Error(
        'CLOUDINARY_API_SECRET is not defined in environment variables',
      );
    }

    const signature = cloudinary.utils.api_sign_request(
      {
        folder: folderPath,
        timestamp: timestamp,
      },
      apiSecret,
    );

    return {
      data: {
        signature,
        timestamp,
        cloudName: this.configService.get<string>('CLOUDINARY_NAME'),
        apiKey: this.configService.get<string>('CLOUDINARY_API_KEY'),
        folder: folderPath,
      },
      message: 'Upload signature generated successfully',
    };
  }

  /**
   * Internal helper to upload files directly from the server buffer.
   * Returns raw Cloudinary response for internal service consumption.
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'general',
    resourceType: 'auto' | 'image' | 'video' | 'raw' = 'auto',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const prefix =
      this.configService.get<string>('CLOUDINARY_FOLDER_PREFIX') || 'app';

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: `${prefix}/${folder}`,
          resource_type: resourceType,
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

  /**
   * Internal helper to delete assets from Cloudinary.
   */
  async deleteFile(
    publicId: string,
    resourceType: string = 'image',
  ): Promise<any> {
    return new Promise((resolve, reject) => {
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
