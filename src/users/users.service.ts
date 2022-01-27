import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './user.entity';
import { CreateUserDto } from './create-user.dto';
import { FilesService } from '../files/files.service';
import { PrivateFilesService } from '../privateFiles/privateFiles.service';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly filesService: FilesService,
    private readonly privateFilesService: PrivateFilesService,
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

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcryptjs.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcryptjs.compare(refreshToken, user.currentHashedRefreshToken);

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.userRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
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

  async addPrivateFile(userId: number, imageBuffer: Buffer, filename: string) {
    return this.privateFilesService.uploadPrivateFile(imageBuffer, userId, filename);
  }

  async getPrivateFile(userId: number, fileId: number) {
    const file = await this.privateFilesService.getPrivateFile(fileId);
    if (file.info.owner.id === userId) {
      return file;
    }
    throw new UnauthorizedException();
  }

  async getAllPrivateFiles(userId: number) {
    const userWithFiles = await this.userRepository.findOne({ id: userId }, { relations: ['files'] });
    if (userWithFiles) {
      return Promise.all(
        userWithFiles.files.map(async (file) => {
          const url = await this.privateFilesService.generatePresignedUrl(file.key);
          return {
            ...file,
            url,
          };
        }),
      );
    }
    throw new NotFoundException('User with this id does not exist');
  }
}
