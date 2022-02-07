import { UsersService } from './users.service';
import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/guard/jwt.guard';
import { RequestWithUser } from '../authentication/auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import FindOneParams from '../utils/findOneParams';
import LocalFilesInterceptor from '../localFIles/localFiles.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '/avatars',
      fileFilter: (request, file, callback) => {
        if (!file.mimetype.includes('image')) {
          return callback(new BadRequestException('Provide a valid image'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: Math.pow(1024, 2), // 1MB
      },
    }),
  )
  async addAvatar(@Req() request: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.addAvatar(request.user.id, {
      path: file.path,
      filename: file.originalname,
      mimetype: file.mimetype,
    });
  }

  @Post('background')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addPublicFile(@Req() request: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.addPublicFile(request.user.id, file.buffer, file.originalname);
  }

  @Post('files')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addPrivateFile(@Req() request: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.addPrivateFile(request.user.id, file.buffer, file.originalname);
  }

  @Get('files/:id')
  @UseGuards(JwtAuthGuard)
  async getPrivateFile(@Req() request: RequestWithUser, @Param() { id }: FindOneParams, @Res() res: Response) {
    const file = await this.usersService.getPrivateFile(request.user.id, Number(id));
    file.stream.pipe(res);
  }

  @Get('files')
  @UseGuards(JwtAuthGuard)
  async getAllPrivateFiles(@Req() request: RequestWithUser) {
    return this.usersService.getAllPrivateFiles(request.user.id);
  }

  @Delete('avatar')
  @UseGuards(JwtAuthGuard)
  async deleteAvatar(@Req() request: RequestWithUser) {
    return this.usersService.deleteAvatar(request.user.id);
  }

  @Delete('files/:id')
  @UseGuards(JwtAuthGuard)
  async deletePrivateFile(@Req() request: RequestWithUser, @Param() { id }: FindOneParams) {
    return this.usersService.deletePrivateFile(request.user.id, id);
  }

  @Delete('background')
  @UseGuards(JwtAuthGuard)
  async deletePublicFile(@Req() request: RequestWithUser) {
    return this.usersService.deletePublicFileBackground(request.user.id);
  }
}
