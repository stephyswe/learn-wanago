import User from '../users/user.entity';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(7)
  password: string;

  @IsOptional()
  address: {};
}

export class LogInDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(7)
  password: string;
}

export interface RequestWithUser {
  user: User;
}

export class TokenPayload {
  userId: number;
}
