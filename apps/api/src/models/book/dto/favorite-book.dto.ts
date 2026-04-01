import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class FavoriteBookDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isFavorite: boolean;
}
