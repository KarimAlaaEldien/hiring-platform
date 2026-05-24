import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/schemas/user.schema';
import type { AuthRequest } from '../types/auth-request';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.COMPANY)
  @Post()
  create(@Req() req: AuthRequest, @Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(req.user._id.toString(), createJobDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.jobsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.COMPANY)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: Partial<CreateJobDto>) {
    return this.jobsService.update(id, updateJobDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.COMPANY)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/save')
  toggleSave(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.jobsService.toggleSave(req.user._id.toString(), id);
  }
}
