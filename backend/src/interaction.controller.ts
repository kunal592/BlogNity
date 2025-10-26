import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { InteractionService } from './interaction.service';

@Controller('interaction')
export class InteractionController {
    constructor(private readonly interactionService: InteractionService) {}

    @Post('follow')
    follow(@Body('followerId') followerId: string, @Body('followingId') followingId: string) {
        return this.interactionService.follow(followerId, followingId);
    }

    @Post('unfollow')
    unfollow(@Body('followerId') followerId: string, @Body('followingId') followingId: string) {
        return this.interactionService.unfollow(followerId, followingId);
    }
}