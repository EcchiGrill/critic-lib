import {
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export const maxFileSize = 5 * 1024 * 1024; // 5MB
const fileTypes = ['png', 'jpg', 'webp'];

export const uploadImagePipe = new ParseFilePipe({
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  fileIsRequired: true,
  validators: [
    new MaxFileSizeValidator({ maxSize: maxFileSize }),
    new FileTypeValidator({
      fileType: new RegExp(`(${fileTypes.join('|')})$`),
    }),
  ],
});
