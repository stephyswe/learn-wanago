
import { Controller, Post, Req, UseGuards, Get } from '@nestjs/common';
import { RequestWithUser } from '../authentication/auth.dto';
import { JwtAuthGuard } from '../authentication/guard/jwt.guard';
import SubscriptionsService from './subscriptions.service';

@Controller('subscriptions')
export default class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService
  ) {}

  @Post('monthly')
  @UseGuards(JwtAuthGuard)
  async createMonthlySubscription(@Req() request: RequestWithUser) {
    return this.subscriptionsService.createMonthlySubscription(request.user.stripeCustomerId);
  }

  @Get('monthly')
  @UseGuards(JwtAuthGuard)
  async getMonthlySubscription(@Req() request: RequestWithUser) {
    return this.subscriptionsService.getMonthlySubscription(request.user.stripeCustomerId);
  }
}