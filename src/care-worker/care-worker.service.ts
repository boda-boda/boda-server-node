import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CareWorkerMetaEntity } from 'src/care-worker-meta/care-worker-meta.entity';
import { CareWorkerScheduleEntity } from 'src/care-worker-schedule/care-worker-schedule.entity';
import { CAPABILITY, CAREER, PERSONALITY, REGION } from 'src/constant';
import { Repository } from 'typeorm';
import { CareWorkerEntity } from './care-worker.entity';
import CreateWorkerRequest from './dto/create-worker-request';
import * as AWS from 'aws-sdk';
import { v4 } from 'uuid';

@Injectable()
export class CareWorkerService {
  public constructor(
    @InjectRepository(CareWorkerEntity)
    public readonly careWorkerEntity: Repository<CareWorkerEntity>,

    @InjectRepository(CareWorkerMetaEntity)
    public readonly careWorkerMetaEntity: Repository<CareWorkerMetaEntity>,

    @InjectRepository(CareWorkerScheduleEntity)
    public readonly careWorkerScheduleEntity: Repository<CareWorkerScheduleEntity>,
  ) {}

  public getCareWorkerById(id: number) {
    return this.careWorkerEntity.findOne({
      relations: ['careWorkerMetas', 'careWorkerSchedules'],
      where: {
        id,
      },
    });
  }

  public getCareWorkersByCareCenterId(careCenterId: number) {
    return this.careWorkerEntity.find({
      relations: ['careWorkerMetas', 'careWorkerSchedules'],
      where: {
        careCenterId,
      },
    });
  }

  public async createCareWorker(careCenterId: number, careWorker: CreateWorkerRequest) {
    const newCareWorker = this.careWorkerEntity.create({
      ...careWorker.basicWorkerState,
      careCenterId,
    });
    const targetWorker = await this.careWorkerEntity.save(newCareWorker);

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

    const personalityMeta = careWorker.selectedPersonalities.map((val) => {
      return {
        type: PERSONALITY,
        key: val,
        careWorkerId: targetWorker.id,
      };
    });

    const allMetaEntity = this.careWorkerMetaEntity.create([
      ...capabilityMeta,
      ...careerMeta,
      ...personalityMeta,
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

    const scheduleMetaEntity = this.careWorkerScheduleEntity.create(scheduleMeta);
    await this.careWorkerMetaEntity.save(allMetaEntity);
    await this.careWorkerScheduleEntity.save(scheduleMetaEntity);

    return targetWorker;
  }

  public async updateCareWorker(careCenterId: number, careWorker: CreateWorkerRequest) {
    const targetWorker = await this.careWorkerEntity.findOne({
      where: {
        id: careWorker.id,
      },
    });

    if (targetWorker.careCenterId !== careCenterId) {
      throw new UnauthorizedException('권한이 없습니다.');
    }

    const updatedTargetWorker = this.careWorkerEntity.merge(
      targetWorker,
      careWorker.basicWorkerState,
    );

    const result = await this.careWorkerEntity.save(updatedTargetWorker);

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

    const personalityMeta = careWorker.selectedPersonalities.map((val) => {
      return {
        type: PERSONALITY,
        key: val,
        careWorkerId: careWorker.id,
      };
    });

    const allMetaEntity = this.careWorkerMetaEntity.create([
      ...capabilityMeta,
      ...careerMeta,
      ...personalityMeta,
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

    const scheduleMetaEntity = this.careWorkerScheduleEntity.create(scheduleMeta);
    await this.careWorkerMetaEntity.save(allMetaEntity);
    await this.careWorkerScheduleEntity.save(scheduleMetaEntity);

    return targetWorker;
  }

  public async isThisWorkerIsMine(myId: number, workerId: number) {
    const worker = await this.careWorkerEntity.findOne({
      where: {
        id: workerId,
      },
    });

    if (!worker) throw new NotFoundException('해당 Id의 careWorker가 존재하지 않습니다.');

    return worker.careCenterId === myId;
  }

  public async deleteCareWorker(careWorkerId: number) {
    await this.deleteAllCurrentMetadataOfCareWorker(careWorkerId);

    return await this.careWorkerEntity.delete({ id: careWorkerId });
  }

  public async uploadImage(file: any) {
    const { originalname } = file;
    const bucketS3 = process.env.BUCKET_NAME;
    return await this.uploadS3(file.buffer, bucketS3, `newFiles/${v4()}_${originalname}`);
  }

  public async uploadProfileImage(id: number, file: any) {
    const careWorker = await this.careWorkerEntity.findOne({ where: { id } });
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
    await this.careWorkerEntity.save(careWorker);

    return careWorker;
  }

  private async deleteAllCurrentMetadataOfCareWorker(careWorkerId: number) {
    await this.careWorkerMetaEntity.delete({
      careWorkerId,
    });

    await this.careWorkerScheduleEntity.delete({
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
