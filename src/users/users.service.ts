import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import User from './user.entity';
import { CreateUserDto } from './create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      console.log('user error', error.code);
      if (error?.code === '23505') {
        throw new NotAcceptableException('User with that email already exists');
      }
    }
  }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    if (!user) throw new NotFoundException(`no user with id: ${id}`);
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });
    if (!user)
      throw new NotFoundException('User with this email does not exist');
    return user;
  }
}
