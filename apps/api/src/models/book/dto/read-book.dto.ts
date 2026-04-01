import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ReadBookDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isRead: boolean;
}
