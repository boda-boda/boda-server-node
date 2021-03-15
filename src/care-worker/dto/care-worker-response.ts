import CareCenterResponse from 'src/care-center/dto/care-center-response.dto';
import { CareWorkerEntity } from '../care-worker.entity';
import CareWorkerScheduleResponse from './care-worker-schedule-response';
import CareWorkerMetaResponse from 'src/care-worker-meta/dto/care-worker-meta-response';
import CareWorkerAreaResponse from 'src/care-worker-area/model/care-worker-area-response';
import CareWorkerCareerResponse from 'src/care-worker-career/model/care-worker-career-response';

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
    this.careCenter = careWorkerEntity.careCenter
      ? new CareCenterResponse(careWorkerEntity.careCenter)
      : null;
    this.careWorkerSchedules = careWorkerEntity.careWorkerSchedules
      ? careWorkerEntity.careWorkerSchedules.map(
          (careWorkerSchedule) => new CareWorkerScheduleResponse(careWorkerSchedule),
        )
      : [];
    this.careWorkerMetas = careWorkerEntity.careWorkerMetas
      ? careWorkerEntity.careWorkerMetas.map(
          (careWorkerMeta) => new CareWorkerMetaResponse(careWorkerMeta),
        )
      : [];
    this.careWorkerAreas = careWorkerEntity.careWorkerAreas
      ? careWorkerEntity.careWorkerAreas.map(
          (careWorkerArea) => new CareWorkerAreaResponse(careWorkerArea),
        )
      : [];
    this.careWorkerCareers = careWorkerEntity.careWorkerCareers
      ? careWorkerEntity.careWorkerCareers.map(
          (careWorkerCareer) => new CareWorkerCareerResponse(careWorkerCareer),
        )
      : [];
  }

  public id: string;
  public name: string;
  public gender: string;
  public age: number;
  public phoneNumber: string;
  public profile: string;
  public address: string;
  public description: string;
  public careCenter?: CareCenterResponse;
  public careWorkerMetas: CareWorkerMetaResponse[];
  public careWorkerSchedules: CareWorkerScheduleResponse[];
  public careWorkerAreas: CareWorkerAreaResponse[];
  public careWorkerCareers: CareWorkerCareerResponse[];
}
