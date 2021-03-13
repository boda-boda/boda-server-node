import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareCenterMetaEntity } from './care-center-meta.entity';
import * as AWS from 'aws-sdk';
import { v4 } from 'uuid';

@Injectable()
export class CareCenterMetaService {
  public constructor(
    @InjectRepository(CareCenterMetaEntity)
    public readonly careCenterMetaRepository: Repository<CareCenterMetaEntity>,
  ) {}

  public async uploadCareCenterImage(careCenterId: string, file: any) {
    const newCareCenterMeta = this.careCenterMetaRepository.create({
      careCenterId,
    });

    const { originalname } = file;
    const bucketS3 = process.env.BUCKET_NAME;
    const data = (await this.uploadS3(
      file.buffer,
      bucketS3,
      `newFiles/${v4()}_${originalname}`,
    )) as any;

    const careCenterImage = data.Location;

    newCareCenterMeta.value = careCenterImage;
    newCareCenterMeta.careCenterId = careCenterId;
    newCareCenterMeta.type = 'image';
    newCareCenterMeta.key = 'url';
    await this.careCenterMetaRepository.save(newCareCenterMeta);

    return newCareCenterMeta;
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
