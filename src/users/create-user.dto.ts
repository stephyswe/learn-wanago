import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  email: string;
  password: string;
}
