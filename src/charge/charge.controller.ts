import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/guard/jwt.guard';
import CreateChargeDto from './dto/createCharge.dto';

import StripeService from '../stripe/stripe.service';
import { RequestWithUser } from '../authentication/auth.dto';

@Controller('charge')
export default class ChargeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createCharge(@Body() charge: CreateChargeDto, @Req() request: RequestWithUser) {
    return this.stripeService.charge(charge.amount, charge.paymentMethodId, request.user.stripeCustomerId);
  }
}
