import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user.entity';
import { UsersController } from './users.controller';
import { FilesModule } from '../files/files.module';
import { PrivateFilesModule } from '../privateFiles/privateFiles.module';
import { StripeModule } from '../stripe/stripe.module';
import { DatabaseFilesModule } from '../databaseFiles/databaseFiles.module';
import { ConfigModule } from '@nestjs/config';
import { LocalFilesModule } from '../localFIles/localFiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    FilesModule,
    DatabaseFilesModule,
    PrivateFilesModule,
    StripeModule,
    LocalFilesModule,
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
