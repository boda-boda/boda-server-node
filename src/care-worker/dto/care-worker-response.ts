import { CareWorkerMetaEntity } from 'src/care-worker-meta/care-worker-meta.entity';
import { CareWorkerScheduleEntity } from 'src/care-worker-schedule/care-worker-schedule.entity';
import CareCenterResponse from 'src/care-center/dto/care-center-response.dto';
import { CareWorkerEntity } from '../care-worker.entity';

export default class CareWorkerResponse {
  public constructor(careWorkerEntity: CareWorkerEntity) {
    this.id = careWorkerEntity.id;
    this.age = careWorkerEntity.age;
    this.name = careWorkerEntity.name;
    this.gender = careWorkerEntity.isFemale ? '여성' : '남성';
    this.profile = careWorkerEntity.profile;
    this.phoneNumber = careWorkerEntity.phoneNumber;
    this.address = careWorkerEntity.address;
    this.description = careWorkerEntity.description;
    this.careCenterId = careWorkerEntity.careCenterId;
    this.careCenter = careWorkerEntity.careCenter
      ? new CareCenterResponse(careWorkerEntity.careCenter)
      : null;
    this.careWorkerSchedules = careWorkerEntity.careWorkerSchedules;
    this.careWorkerMetas = careWorkerEntity.careWorkerMetas;
  }

  public id: string;
  public name: string;
  public gender: string;
  public age: number;
  public phoneNumber: string;
  public profile: string;
  public address: string;
  public description: string;
  public careCenterId: string;
  public careCenter?: CareCenterResponse;
  public careWorkerMetas: CareWorkerMetaEntity[];
  public careWorkerSchedules: CareWorkerScheduleEntity[];
}
