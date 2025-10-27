import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.notification.findMany();
  }

  markRead(id: string, isRead: boolean) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead },
    });
  }
}
