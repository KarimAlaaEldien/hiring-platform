import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application, ApplicationDocument, ApplicationStatus } from './schemas/application.schema';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { JobsService } from '../jobs/jobs.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
    private jobsService: JobsService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  private getId(value: any): string {
    if (!value) return '';
    return (value._id || value).toString();
  }

  async create(developerId: string, createApplicationDto: CreateApplicationDto) {
    const job = await this.jobsService.findOne(createApplicationDto.jobId);
    if (!job) throw new NotFoundException('Job not found');

    const existingApplication = await this.applicationModel.findOne({
      jobId: createApplicationDto.jobId,
      developerId,
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied for this job');
    }

    const application = new this.applicationModel({
      ...createApplicationDto,
      developerId,
    });

    const savedApplication = await application.save();

    // Notify the company
    const companyIdStr = job.companyId
      ? ((job.companyId as any)._id ? (job.companyId as any)._id.toString() : job.companyId.toString())
      : '';

    if (companyIdStr) {
      this.notificationsGateway.sendNotification(companyIdStr, 'newApplication', {
        jobId: job._id,
        jobTitle: job.title,
        applicationId: savedApplication._id,
      });
    }

    return savedApplication;
  }

  async findByDeveloper(developerId: string) {
    return this.applicationModel
      .find({ developerId })
      .populate({
        path: 'jobId',
        select: 'title company companyId location type',
        populate: { path: 'companyId', select: 'companyName name' },
      })
      .sort({ createdAt: -1 });
  }

  async findByJob(jobId: string, companyId: string) {
    // Verify company owns the job
    const job = await this.jobsService.findOne(jobId);
    if (this.getId(job.companyId) !== this.getId(companyId)) {
      throw new BadRequestException('You do not have permission to view these applications');
    }

    return this.applicationModel
      .find({ jobId })
      .populate('developerId', 'name email bio resumeUrl')
      .sort({ createdAt: -1 });
  }

  async findByCompany(companyId: string) {
    const jobs = await this.jobsService.findByCompany(companyId);
    const jobIds = jobs.map(j => j._id.toString());
    return this.applicationModel
      .find({ jobId: { $in: jobIds } } as any)
      .populate('jobId', 'title location type')
      .populate('developerId', 'name email bio resumeUrl')
      .sort({ createdAt: -1 });
  }

  async updateStatus(id: string, companyId: string, updateDto: UpdateApplicationStatusDto) {
    const application = await this.applicationModel.findById(id).populate('jobId');
    if (!application) throw new NotFoundException('Application not found');

    const job = application.jobId as any;
    if (this.getId(job.companyId) !== this.getId(companyId)) {
      throw new BadRequestException('Permission denied');
    }

    application.status = updateDto.status;
    await application.save();

    // Notify developer
    this.notificationsGateway.sendNotification(application.developerId.toString(), 'applicationUpdate', {
      applicationId: application._id,
      jobTitle: job.title,
      status: application.status,
    });

    return application;
  }
}
