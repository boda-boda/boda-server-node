import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CareWorkerMetaEntity } from 'src/care-worker-meta/care-worker-meta.entity';
import { CareWorkerScheduleEntity } from 'src/care-worker-schedule/care-worker-schedule.entity';
import { CAPABILITY, CAREER, REGION } from 'src/constant';
import { Repository } from 'typeorm';
import { CareWorkerEntity } from './care-worker.entity';
import CreateWorkerRequest from './dto/create-worker-request';
import * as AWS from 'aws-sdk';
import { v4 } from 'uuid';

@Injectable()
export class CareWorkerService {
  public constructor(
    @InjectRepository(CareWorkerEntity)
    public readonly careWorkerRepository: Repository<CareWorkerEntity>,

    @InjectRepository(CareWorkerMetaEntity)
    public readonly careWorkerMetaRepository: Repository<CareWorkerMetaEntity>,

    @InjectRepository(CareWorkerScheduleEntity)
    public readonly careWorkerScheduleRepository: Repository<CareWorkerScheduleEntity>,
  ) {}

  public getCareWorkerById(id: number) {
    return this.careWorkerRepository.findOne({
      relations: ['careWorkerMetas', 'careWorkerSchedules'],
      where: {
        id,
      },
    });
  }

  public getCareWorkersByCareCenterId(careCenterId: string) {
    return this.careWorkerRepository.find({
      relations: ['careWorkerMetas', 'careWorkerSchedules'],
      where: {
        careCenterId,
      },
    });
  }

  public async createCareWorker(careCenterId: string, careWorker: CreateWorkerRequest) {
    const newCareWorker = this.careWorkerRepository.create({
      ...careWorker.basicWorkerState,
      careCenterId,
    });
    const testWorker = await this.careWorkerRepository.findOne({ where: { name: 'testworker12' } });

    const targetWorker = await this.careWorkerRepository.save(newCareWorker);

    const regionMeta = careWorker.regions.map((k) => {
      return {
        type: REGION,
        key: k,
        careWorkerId: targetWorker.id,
      };
    });

    const capabilityMeta = careWorker.capableKeyPair.map((k) => {
      return {
        type: CAPABILITY,
        key: k.key,
        value: k.value,
        careWorkerId: targetWorker.id,
      };
    });

    const careerMeta = careWorker.careerKeyPair.map((k) => {
      return {
        type: CAREER,
        key: k.key,
        value: k.value,
        careWorkerId: targetWorker.id,
      };
    });

    const allMetaEntity = this.careWorkerMetaRepository.create([
      ...capabilityMeta,
      ...careerMeta,
      ...regionMeta,
    ]);

    const scheduleMeta = Object.keys(careWorker.scheduleTableInfo).reduce((acc, val) => {
      const schedules = careWorker.scheduleTableInfo[val];
      const newMeta = schedules.map((s) => {
        return {
          day: val,
          startAt: s[0],
          endAt: s[1],
          careWorkerId: targetWorker.id,
        };
      });
      return [...acc, ...newMeta];
    }, []);

    const scheduleMetaEntity = this.careWorkerScheduleRepository.create(scheduleMeta);
    await this.careWorkerMetaRepository.save(allMetaEntity);
    await this.careWorkerScheduleRepository.save(scheduleMetaEntity);

    return targetWorker;
  }

  public async updateCareWorker(careCenterId: string, careWorker: CreateWorkerRequest) {
    const targetWorker = await this.careWorkerRepository.findOne({
      where: {
        id: careWorker.id,
      },
    });
    if (targetWorker.careCenterId !== careCenterId) {
      throw new UnauthorizedException('권한이 없습니다.');
    }
    const updatedTargetWorker = this.careWorkerRepository.merge(
      targetWorker,
      careWorker.basicWorkerState,
    );

    const result = await this.careWorkerRepository.save(updatedTargetWorker);

    await this.deleteAllCurrentMetadataOfCareWorker(careWorker.id);

    const regionMeta = careWorker.regions.map((k) => {
      return {
        type: REGION,
        key: k,
        careWorkerId: targetWorker.id,
      };
    });

    const capabilityMeta = careWorker.capableKeyPair.map((k) => {
      return {
        type: CAPABILITY,
        key: k.key,
        value: k.value,
        careWorkerId: careWorker.id,
      };
    });

    const careerMeta = careWorker.careerKeyPair.map((k) => {
      return {
        type: CAREER,
        key: k.key,
        value: k.value,
        careWorkerId: careWorker.id,
      };
    });

    const allMetaEntity = this.careWorkerMetaRepository.create([
      ...capabilityMeta,
      ...careerMeta,
      ...regionMeta,
    ]);

    const scheduleMeta = Object.keys(careWorker.scheduleTableInfo).reduce((acc, val) => {
      const schedules = careWorker.scheduleTableInfo[val];
      const newMeta = schedules.map((s) => {
        return {
          day: val,
          startAt: s[0],
          endAt: s[1],
          careWorkerId: careWorker.id,
        };
      });
      return [...acc, ...newMeta];
    }, []);

    const scheduleMetaEntity = this.careWorkerScheduleRepository.create(scheduleMeta);
    await this.careWorkerMetaRepository.save(allMetaEntity);
    await this.careWorkerScheduleRepository.save(scheduleMetaEntity);

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
    await this.careWorkerMetaRepository.delete({
      careWorkerId,
    });

    await this.careWorkerScheduleRepository.delete({
      careWorkerId,
    });
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
