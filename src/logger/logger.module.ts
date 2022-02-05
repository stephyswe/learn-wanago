import { Module } from '@nestjs/common';
import CustomLogger from './customLogger';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Log from './log.entity';
import LogsService from './logger.service';
import LoggerController from './logger.controller';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Log])],
  controllers: [LoggerController],
  providers: [CustomLogger, LogsService],
  exports: [CustomLogger],
})
export class LoggerModule {}
