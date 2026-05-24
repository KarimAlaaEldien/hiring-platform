import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async create(companyId: string, createJobDto: CreateJobDto) {
    const newJob = new this.jobModel({
      ...createJobDto,
      companyId,
    });
    return newJob.save();
  }

  async findAll(query: any) {
    const filter: any = {};
    if (query.title) filter.title = new RegExp(query.title, 'i');
    if (query.location) filter.location = new RegExp(query.location, 'i');
    if (query.type) filter.type = new RegExp(query.type, 'i');
    if (query.companyId) filter.companyId = query.companyId;
    
    return this.jobModel.find(filter).populate('companyId', 'name companyName').sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const job = await this.jobModel.findById(id).populate('companyId', 'name companyName');
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async update(id: string, updateData: Partial<CreateJobDto>) {
    const job = await this.jobModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async remove(id: string) {
    const job = await this.jobModel.findByIdAndDelete(id);
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async findByCompany(companyId: string) {
    return this.jobModel.find({ companyId }).sort({ createdAt: -1 });
  }

  async toggleSave(userId: string, jobId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    
    if (!user.savedJobs) user.savedJobs = [];
    
    const index = user.savedJobs.indexOf(jobId);
    if (index > -1) {
      user.savedJobs.splice(index, 1);
    } else {
      user.savedJobs.push(jobId);
    }
    
    await user.save();
    return { savedJobs: user.savedJobs };
  }
}
