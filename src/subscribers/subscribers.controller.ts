import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/guard/jwt.guard';
import CreateSubscriberDto from './dto/createSubscriber.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('subscribers')
@UseInterceptors(ClassSerializerInterceptor)
export default class SubscribersController {
  constructor(@Inject('SUBSCRIBERS_SERVICE') private subscribersService: ClientProxy) {}
  @Get()
  async getSubscribers() {
    return this.subscribersService.send(
      {
        cmd: 'get-all-subscribers',
      },
      '',
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() subscriber: CreateSubscriberDto) {
    return this.subscribersService.send(
      {
        cmd: 'add-subscriber',
      },
      subscriber,
    );
  }
}