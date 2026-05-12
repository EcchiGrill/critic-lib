import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import type { Express } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';
import { maxFileSize, uploadImagePipe } from './upload-image.pipe';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('images')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['files'],
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Image files to upload (max 10 files, 5MB each)',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadImages(
    @UploadedFiles(uploadImagePipe) files: Express.Multer.File[]
  ): Promise<{ urls: string[] }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const allowedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
    ];

    for (const file of files) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `Invalid file type: ${file.originalname}. Allowed types: png, jpg, jpeg, webp`
        );
      }
      if (file.size > maxFileSize) {
        throw new BadRequestException(
          `File too large: ${file.originalname}. Max size: 5MB`
        );
      }
    }

    const uploadPromises = files.map((file) =>
      this.cloudinaryService.uploadBuffer(file.buffer, 'uploads')
    );

    const urls = await Promise.all(uploadPromises);

    return { urls };
  }
}
