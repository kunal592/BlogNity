import { Controller, Get, Param, Patch, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  listUsers() {
    return this.adminService.listUsers();
  }

  @Get('posts')
  listPosts() {
    return this.adminService.listPosts();
  }

  @Get('reported-comments')
  listReportedComments() {
    return this.adminService.listReportedComments();
  }

  @Patch('reported-comments/:id/resolve')
  resolveReportedComment(@Param('id') id: string) {
    return this.adminService.resolveReportedComment(id);
  }

  @Delete('content/:id')
  manageContent(@Param('id') id: string) {
    return this.adminService.manageContent(id);
  }
}
