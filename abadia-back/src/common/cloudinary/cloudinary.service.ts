import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  uploadImage(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'abadia/servicios/imagenes' },
        (error, result) => {
          if (error) return reject(new Error(error.message));
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  uploadVideo(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'abadia/servicios/videos',
          resource_type: 'video',
        },
        (error, result) => {
          if (error) return reject(new Error(error.message));
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  extractPublicId(url: string): string | null {
    if (!url || !url.includes('res.cloudinary.com')) {
      return null;
    }
    const cleanUrl = url.split('?')[0];
    const match = cleanUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^./]+)?$/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  async deleteByUrl(
    url: string,
    resourceType: 'image' | 'video' = 'image',
  ): Promise<void> {
    const publicId = this.extractPublicId(url);
    if (!publicId) {
      return;
    }

    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
    } catch (error) {
      this.logger.warn(
        `No se pudo eliminar recurso de Cloudinary (${publicId}): ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
