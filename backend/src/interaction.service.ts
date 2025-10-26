import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InteractionService {
    constructor(private readonly prisma: PrismaService) {}

    follow(followerId: string, followingId: string) {
        return this.prisma.follow.create({
            data: {
                followerId,
                followingId,
            },
        });
    }

    unfollow(followerId: string, followingId: string) {
        return this.prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });
    }
}