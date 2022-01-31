import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import EmailScheduleController from './emailSchedule.controller';
import EmailScheduleService from './emailSchedule.service';

@Module({
  imports: [EmailModule],
  controllers: [EmailScheduleController],
  providers: [EmailScheduleService],
})
export class EmailScheduleModule {}
