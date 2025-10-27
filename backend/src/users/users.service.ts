import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({ include: { posts: true }});
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id }, include: { posts: true }});
  }

  findBookmarks(id: string) {
    return this.prisma.user.findUnique({ where: { id }}).bookmarks({ include: { posts: true }});
  }
}
