import { Body, Controller, Post, Req, UseGuards, Get, HttpCode } from '@nestjs/common';
import { RequestWithUser } from '../authentication/auth.dto';
import { JwtAuthGuard } from '../authentication/guard/jwt.guard';
import StripeService from '../stripe/stripe.service';
import AddCreditCardDto from './dto/addCreditCardDto';
import SetDefaultCreditCardDto from './dto/setDefaultCreditCard.dto';

@Controller('credit-cards')
export default class CreditCardsController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addCreditCard(@Body() creditCard: AddCreditCardDto, @Req() request: RequestWithUser) {
    return this.stripeService.attachCreditCard(creditCard.paymentMethodId, request.user.stripeCustomerId);
  }

  @Post('default')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async setDefaultCard(@Body() creditCard: SetDefaultCreditCardDto, @Req() request: RequestWithUser) {
    return this.stripeService.setDefaultCreditCard(creditCard.paymentMethodId, request.user.stripeCustomerId);
  }

  @Post('card')
  @UseGuards(JwtAuthGuard)
  async getCreditCards(@Body() creditCard: SetDefaultCreditCardDto) {
    return this.stripeService.listCustomerCard(creditCard.paymentMethodId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async listCreditCards(@Req() request: RequestWithUser) {
    return this.stripeService.listCreditCards(request.user.stripeCustomerId);
  }
}
