import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';

@Injectable()
export class MonetizationService {
  private razorpay: Razorpay;

  constructor(private readonly configService: ConfigService) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get('RAZORPAY_KEY_SECRET'),
    });
  }

  async createSubscription(planId: string, customerId: string) {
    const subscription = await this.razorpay.subscriptions.create({
      plan_id: planId,
      customer_id: customerId,
      total_count: 12, // yearly subscription
    });

    return subscription;
  }
}
