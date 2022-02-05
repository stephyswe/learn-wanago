import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Log from './log.entity';
import CreateLogDto from './dto/createLog.dto';

@Injectable()
export default class LogsService {
  constructor(
    @InjectRepository(Log)
    private logsRepository: Repository<Log>,
  ) {}

  async createLog(log: CreateLogDto) {
    const newLog = await this.logsRepository.create(log);
    await this.logsRepository.save(newLog, {
      data: {
        isCreatingLogs: true,
      },
    });
    return newLog;
  }

  async findAll(context: any) {
    if (context) {
      return await this.logsRepository.find({ context });
    }
    return await this.logsRepository.find();
  }

  async removeAll() {
    const allRows = await this.logsRepository.find();
    allRows.forEach((row) => {
      this.logsRepository.delete(row.id);
    });
  }
}
