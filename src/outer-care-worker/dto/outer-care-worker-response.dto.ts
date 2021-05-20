import OuterCareWorkerAreaResponse from 'src/outer-care-worker/dto/outer-care-worker-area-response';
import OuterCareWorkerCareerResponse from 'src/outer-care-worker/dto/outer-care-worker-career-response';
import OuterCareWorkerMetaResponse from 'src/outer-care-worker/dto/outer-care-worker-meta-response';
import { OuterCareWorkerEntity } from '../entity/outer-care-worker.entity';

export default class OuterCareWorkerResponse {
  constructor(o: OuterCareWorkerEntity) {
    this.id = o.id;
    this.name = o.name ? o.name[0] + 'XX' : '';
    this.gender = o.isFemale ? '여성' : '남성';
    this.profile = o.profile;
    this.age = o.birthDay ? new Date().getFullYear() - new Date(o.birthDay).getFullYear() + 1 : 0;
    this.birthDay = new Date(o.birthDay).getFullYear() + '-XX-XX';
    this.address = o.address;
    this.description = o.description;
    this.schedule = o.schedule;
    this.phoneNumber = '010XXXXXXXX';
    this.religion = o.religion;
    this.outerCareWorkerMetas = o.outerCareWorkerMetas
      ? o.outerCareWorkerMetas.map(
          (careWorkerMeta) => new OuterCareWorkerMetaResponse(careWorkerMeta),
        )
      : [];
    this.outerCareWorkerAreas = o.outerCareWorkerAreas
      ? o.outerCareWorkerAreas.map(
          (careWorkerArea) => new OuterCareWorkerAreaResponse(careWorkerArea),
        )
      : [];
    this.outerCareWorkerCareers = o.outerCareWorkerCareers
      ? o.outerCareWorkerCareers.map(
          (careWorkerCareer) => new OuterCareWorkerCareerResponse(careWorkerCareer),
        )
      : [];
    this.licenseDate = o.licenseDate;

    this.metadata = JSON.parse(o.metadata);
  }

  public id: string;
  public name: string;
  public gender: string;
  public profile: string;
  public age: number;
  public birthDay: string;
  public address: string;
  public description: string;
  public schedule: string;
  public phoneNumber: string;
  public licenseDate: string;
  public metadata: string;
  public religion: string;
  public outerCareWorkerMetas: OuterCareWorkerMetaResponse[];
  public outerCareWorkerAreas: OuterCareWorkerAreaResponse[];
  public outerCareWorkerCareers: OuterCareWorkerCareerResponse[];
}
