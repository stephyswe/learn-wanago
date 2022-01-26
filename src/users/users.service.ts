import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './user.entity';
import { CreateUserDto } from './create-user.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly filesService: FilesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
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
    if (!user) throw new NotFoundException('User with this email does not exist');
    return user;
  }

  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const user = await this.getById(userId);
    if (user.avatar) {
      await this.deleteUserAvatar(user);
    }
    const avatar = await this.filesService.uploadPublicFile(imageBuffer, filename);
    await this.userRepository.update(userId, {
      ...user,
      avatar,
    });
    return avatar;
  }

  async deleteAvatar(userId: number) {
    const user = await this.getById(userId);
    await this.deleteUserAvatar(user);
  }
  async deleteUserAvatar(user: User) {
    const fileId = user.avatar?.id;
    if (fileId) {
      await this.userRepository.update(user.id, {
        ...user,
        avatar: null,
      });
      await this.filesService.deletePublicFile(fileId);
    }
  }
}
