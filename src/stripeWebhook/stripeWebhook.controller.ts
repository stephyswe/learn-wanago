import { Controller, Post, Headers, Req, BadRequestException } from '@nestjs/common';
import StripeWebhookService from './stripeWebhook.service';
import StripeService from '../stripe/stripe.service';
import RequestWithRawBody from './requestWithRawBody.interface';

@Controller('webhook')
export default class StripeWebhookController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly stripeWebhookService: StripeWebhookService,
  ) {}

  @Post()
  async handleIncomingEvents(@Headers('stripe-signature') signature: string, @Req() request: RequestWithRawBody) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    const event = await this.stripeService.constructEventFromPayload(signature, request.rawBody);

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
      return this.stripeWebhookService.processSubscriptionUpdate(event);
    }
  }
}
