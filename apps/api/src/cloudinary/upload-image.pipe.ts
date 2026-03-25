import {
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export const maxFileSize = 5 * 1024 * 1024; // 5MB

export const uploadImagePipe = new ParseFilePipe({
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  fileIsRequired: true,
  validators: [new MaxFileSizeValidator({ maxSize: maxFileSize })],
});
