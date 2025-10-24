import { Controller, Get, Param, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  list() {
    return this.notificationService.list();
  }

  @Patch(':id/mark-read')
  markRead(@Param('id') id: string) {
    return this.notificationService.markRead(id);
  }
}
