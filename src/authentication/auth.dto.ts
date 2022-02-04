import User from '../users/user.entity';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Request } from 'express';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

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

export interface RequestWithUser extends Request {
  user: User;
}

export class TokenPayload {
  userId: number;
  isSecondFactorAuthenticated?: boolean;
}
