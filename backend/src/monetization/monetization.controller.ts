import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MonetizationService } from './monetization.service';

@Controller('monetization')
export class MonetizationController {
  constructor(private readonly monetizationService: MonetizationService) {}

  @Post('subscribe')
  @UseGuards(AuthGuard('jwt'))
  async createSubscription(
    @Request() req,
    @Body() body: { planId: string },
  ) {
    const { id: userId } = req.user;
    return this.monetizationService.createSubscription(body.planId, userId);
  }
}
