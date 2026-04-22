import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class GoogleProfileDto {
  @ApiProperty({ example: '1234567890' })
  @IsString()
  googleId: string;

  @ApiProperty({ example: 'reader@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'https://example.com/picture.jpg', required: false })
  @IsOptional()
  @IsString()
  picture?: string;
}
