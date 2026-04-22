import { IsEmail, IsNotEmpty } from 'class-validator';

export class ConfirmEmailDto {
  @IsNotEmpty()
  token: string;
}

export class ResendConfirmationDto {
  @IsEmail()
  email: string;
}
