import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import type { AuthRequest } from '../types/auth-request';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req: AuthRequest) {
    return this.usersService.getProfile(req.user._id.toString());
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  updateProfile(@Req() req: AuthRequest, @Body() body: Record<string, unknown>) {
    return this.usersService.updateProfile(req.user._id.toString(), body);
  }
}
