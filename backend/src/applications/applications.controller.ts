import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/schemas/user.schema';
import type { AuthRequest } from '../types/auth-request';

@Controller('applications')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Roles(Role.DEVELOPER)
  @Post()
  create(@Req() req: AuthRequest, @Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(req.user._id.toString(), createApplicationDto);
  }

  @Roles(Role.DEVELOPER)
  @Get('developer')
  findByDeveloper(@Req() req: AuthRequest) {
    return this.applicationsService.findByDeveloper(req.user._id.toString());
  }

  @Roles(Role.COMPANY)
  @Get('company')
  findByCompany(@Req() req: AuthRequest) {
    return this.applicationsService.findByCompany(req.user._id.toString());
  }

  @Roles(Role.COMPANY)
  @Get('job/:jobId')
  findByJob(@Req() req: AuthRequest, @Param('jobId') jobId: string) {
    return this.applicationsService.findByJob(jobId, req.user._id.toString());
  }

  @Roles(Role.COMPANY)
  @Patch(':id/status')
  updateStatus(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(id, req.user._id.toString(), updateApplicationStatusDto);
  }
}
