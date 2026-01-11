import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { SystemLogService } from '../system-log/system-log.service';
const toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(
    private configService: ConfigService,
    private readonly systemLogService: SystemLogService,
  ) {}

  /**
   * Generates a signature for secure client-side uploads.
   */
  async generateSignature(folder: string = 'general', adminUserUuid?: string) {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const prefix =
        this.configService.get<string>('CLOUDINARY_FOLDER_PREFIX') || 'app';
      const folderPath = `${prefix}/${folder}`;
      const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

      if (!apiSecret) {
        throw new Error('CLOUDINARY_API_SECRET is missing in environment');
      }

      const signature = cloudinary.utils.api_sign_request(
        { folder: folderPath, timestamp },
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
    } catch (error) {
      await this.handleError(
        error,
        'GET',
        'CLOUDINARY_SIGNATURE',
        { folder },
        adminUserUuid,
      );
      throw new InternalServerErrorException(
        'Failed to generate upload signature',
      );
    }
  }

  /**
   * Internal helper to upload files directly from the server buffer.
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
        async (error, result) => {
          if (error) {
            await this.handleError(error, 'POST', 'CLOUDINARY_UPLOAD', {
              folder,
              fileName: file.originalname,
            });
            return reject(error);
          }

          if (!result) {
            const noResultErr = new Error(
              'Cloudinary upload returned no result',
            );
            await this.handleError(noResultErr, 'POST', 'CLOUDINARY_UPLOAD', {
              folder,
            });
            return reject(noResultErr);
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
        async (error, result) => {
          if (error) {
            await this.handleError(error, 'DELETE', 'CLOUDINARY_DELETE', {
              publicId,
            });
            return reject(error);
          }
          resolve(result);
        },
      );
    });
  }

  /**
   * Helper method to record system logs for Cloudinary operations
   */
  private async handleError(
    error: any,
    method: string,
    path: string,
    payload: any,
    userUuid?: string,
  ) {
    this.logger.error(
      `${method} ${path} failed: ${error.message}`,
      error.stack,
    );

    await this.systemLogService.log({
      errorCode:
        error.http_code?.toString() || error.name || 'CLOUDINARY_ERROR',
      message: error.message,
      stack: error.stack,
      path,
      method,
      payload,
      userUuid: userUuid || 'SYSTEM_CLOUD',
    });
  }
}
