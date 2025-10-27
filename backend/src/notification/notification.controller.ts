import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  list() {
    return this.notificationService.list();
  }

  @Put(':id')
  markRead(@Param('id') id: string, @Body('isRead') isRead: boolean) {
    return this.notificationService.markRead(id, isRead);
  }
}
