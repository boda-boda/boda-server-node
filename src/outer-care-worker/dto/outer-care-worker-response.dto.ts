import CareWorkerMetaResponse from 'src/care-worker-meta/dto/care-worker-meta-response';
import { OuterCareWorkerEntity } from '../entity/outer-care-worker.entity';

export default class OuterCareWorkerResponse {
  constructor(o: OuterCareWorkerEntity) {
    this.id = o.id;
    this.name = o.name;
    this.gender = o.isFemale ? '여성' : '남성';
    this.profile = o.profile;
    this.age = o.birthDay ? new Date().getFullYear() - new Date(o.birthDay).getFullYear() + 1 : 0;
    this.careWorkerMetas = o.careWorkerMetas
      ? o.careWorkerMetas.map((careWorkerMeta) => new CareWorkerMetaResponse(careWorkerMeta))
      : [];
  }

  public id: string;
  public name: string;
  public gender: string;
  public profile: string;
  public age: number;
  public careWorkerMetas: CareWorkerMetaResponse[];
}
