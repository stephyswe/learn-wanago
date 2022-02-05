import { Controller, Delete, Get, Query } from '@nestjs/common';
import LogsService from './logger.service';

@Controller('logger')
export default class LoggerController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  async getLogs(@Query('context') context: string) {
    return this.logsService.findAll(context);
  }

  @Delete('all')
  async removeAll() {
    return this.logsService.removeAll();
  }
}
