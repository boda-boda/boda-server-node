import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CAPABILITY } from 'src/constant';
import { Repository } from 'typeorm';
import { CareWorkerEntity } from './care-worker.entity';
import { CreateWorkerRequest } from './dto/create-worker-request';
import * as AWS from 'aws-sdk';
import { v4 } from 'uuid';
import { CareWorkerCareerService } from 'src/care-worker-career/care-worker-career.service';
import { CareWorkerAreaService } from 'src/care-worker-area/care-worker-area.service';
import { CareWorkerMetaService } from 'src/care-worker-meta/care-worker-meta.service';
import { CareWorkerScheduleService } from 'src/care-worker-schedule/care-worker-schedule.service';

@Injectable()
export class CareWorkerService {
  public constructor(
    public readonly careWorkerAreaService: CareWorkerAreaService,
    public readonly careWorkerCareerService: CareWorkerCareerService,
    public readonly careWorkerMetaService: CareWorkerMetaService,
    public readonly careWorkerScheduleService: CareWorkerScheduleService,

    @InjectRepository(CareWorkerEntity)
    public readonly careWorkerRepository: Repository<CareWorkerEntity>,
  ) {}

  public getCareWorkerById(id: number) {
    return this.careWorkerRepository.findOne({
      relations: ['careWorkerMetas', 'careWorkerSchedules', 'careWorkerAreas', 'careWorkerCareers'],
      where: {
        id,
        isDeleted: false,
      },
    });
  }

  public getCareWorkersByCareCenterId(careCenterId: string) {
    return this.careWorkerRepository.find({
      relations: ['careWorkerMetas', 'careWorkerSchedules', 'careWorkerAreas', 'careWorkerCareers'],
      where: {
        careCenterId,
        isDeleted: false,
      },
    });
  }

  public async createCareWorker(careCenterId: string, careWorkerRequest: CreateWorkerRequest) {
    const newCareWorker = this.careWorkerRepository.create({
      ...careWorkerRequest.careWorker,
      careCenterId,
    });
    const targetWorker = await this.careWorkerRepository.save(newCareWorker);

    const capabilityMeta = careWorkerRequest.careWorkerCapabilities.map((key) => {
      return { type: CAPABILITY, key, careWorkerId: targetWorker.id };
    });

    await this.careWorkerMetaService.createCareWorkerMeta(capabilityMeta);

    await this.careWorkerScheduleService.createCareWorkerSchedule(
      careWorkerRequest.careWorkerSchedules,
      targetWorker.id,
    );

    await this.careWorkerCareerService.createCareWorkerCareer(
      careWorkerRequest.careWorkerCareers,
      targetWorker.id,
    );
    await this.careWorkerAreaService.createAreaOfCareWorker(
      careWorkerRequest.careWorkerAreas,
      targetWorker.id,
    );

    return targetWorker;
  }

  public async updateCareWorker(careCenterId: string, careWorkerRequest: CreateWorkerRequest) {
    const targetWorker = await this.careWorkerRepository.findOne({
      where: {
        id: careWorkerRequest.id,
      },
    });

    if (targetWorker.careCenterId !== careCenterId) {
      throw new UnauthorizedException('권한이 없습니다.');
    }

    const updatedTargetWorker = this.careWorkerRepository.merge(
      targetWorker,
      careWorkerRequest.careWorker,
    );

    await this.careWorkerRepository.save(updatedTargetWorker);

    await this.deleteAllCurrentMetadataOfCareWorker(careWorkerRequest.id);

    const capabilityMeta = careWorkerRequest.careWorkerCapabilities.map((key) => {
      return { type: CAPABILITY, key, careWorkerId: targetWorker.id };
    });
    await this.careWorkerMetaService.createCareWorkerMeta(capabilityMeta);

    await this.careWorkerScheduleService.createCareWorkerSchedule(
      careWorkerRequest.careWorkerSchedules,
      targetWorker.id,
    );

    await this.careWorkerCareerService.createCareWorkerCareer(
      careWorkerRequest.careWorkerCareers,
      targetWorker.id,
    );

    await this.careWorkerAreaService.createAreaOfCareWorker(
      careWorkerRequest.careWorkerAreas,
      targetWorker.id,
    );

    return targetWorker;
  }

  public async isThisWorkerIsMine(myId: string, workerId: string) {
    const worker = await this.careWorkerRepository.findOne({
      where: {
        id: workerId,
      },
    });

    if (!worker) throw new NotFoundException('해당 Id의 careWorker가 존재하지 않습니다.');

    return worker.careCenterId === myId;
  }

  public async deleteCareWorker(careWorkerId: string) {
    await this.deleteAllCurrentMetadataOfCareWorker(careWorkerId);

    return await this.careWorkerRepository.delete({ id: careWorkerId });
  }

  public async uploadImage(file: any) {
    const { originalname } = file;
    const bucketS3 = process.env.BUCKET_NAME;
    return await this.uploadS3(file.buffer, bucketS3, `newFiles/${v4()}_${originalname}`);
  }

  public async uploadProfileImage(id: number, file: any) {
    const careWorker = await this.careWorkerRepository.findOne({ where: { id } });
    if (!careWorker) throw new NotFoundException('그런 CAreWorker 없다');

    const { originalname } = file;
    const bucketS3 = process.env.BUCKET_NAME;
    const data = (await this.uploadS3(
      file.buffer,
      bucketS3,
      `newFiles/${v4()}_${originalname}`,
    )) as any;

    const profile = data.Location;

    careWorker.profile = profile;
    await this.careWorkerRepository.save(careWorker);

    return careWorker;
  }

  private async deleteAllCurrentMetadataOfCareWorker(careWorkerId: string) {
    await this.careWorkerMetaService.deleteAllMetaDataOfCareWorker(careWorkerId);
    await this.careWorkerAreaService.deleteAllAreaOfCareWorker(careWorkerId);
    await this.careWorkerScheduleService.deleteAllScheduleOfCareWorker(careWorkerId);
    await this.careWorkerCareerService.deleteAllCareerOfCareWorker(careWorkerId);
  }

  async uploadS3(file, bucket, name) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          console.log(err);
          console.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  getS3() {
    return new AWS.S3({
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.ACCESS_KEY_SECRET,
    });
  }
}
