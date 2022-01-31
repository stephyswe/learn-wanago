import { Body, Controller, UseGuards, Post, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/guard/jwt.guard';
import EmailScheduleService from './emailSchedule.service';
import EmailScheduleDto from './emailSchedule.dto';

@Controller('email-scheduling')
export default class EmailScheduleController {
  constructor(private readonly emailScheduleService: EmailScheduleService) {}

  @Post('schedule')
  @UseGuards(JwtAuthGuard)
  async emailScheduleFunction(@Body() emailSchedule: EmailScheduleDto) {
    this.emailScheduleService.scheduleEmail(emailSchedule);
  }
  @Delete('schedule')
  @UseGuards(JwtAuthGuard)
  async emailScheduleDeleteJobs() {
    this.emailScheduleService.cancelAllScheduledEmails();
  }

}
