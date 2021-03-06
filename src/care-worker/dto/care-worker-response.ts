import { CareWorkerMetaEntity } from 'src/care-worker-meta/care-worker-meta.entity';
import { CareWorkerScheduleEntity } from 'src/care-worker-schedule/care-worker-schedule.entity';
import UserResponse from 'src/user/dto/user-response.dto';
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
    this.userId = careWorkerEntity.userId;
    this.user = careWorkerEntity.user ? new UserResponse(careWorkerEntity.user) : null;
    this.careWorkerSchedules = careWorkerEntity.careWorkerSchedules;
    this.careWorkerMetas = careWorkerEntity.careWorkerMetas;
  }

  public id: number;
  public name: string;
  public gender: string;
  public age: number;
  public phoneNumber: string;
  public profile: string;
  public address: string;
  public description: string;
  public userId: number;
  public user?: UserResponse;
  public careWorkerMetas: CareWorkerMetaEntity[];
  public careWorkerSchedules: CareWorkerScheduleEntity[];
}
