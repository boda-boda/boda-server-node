import { OuterCareWorkerAreaEntity } from '../entity/outer-care-worker-area.entity';

export default class OuterCareWorkerAreaResponse {
  public constructor(outerCareWorkerAreaEntity: OuterCareWorkerAreaEntity) {
    this.id = outerCareWorkerAreaEntity.id;
    this.city = outerCareWorkerAreaEntity.city;
    this.gu = outerCareWorkerAreaEntity.gu;
    this.dong = outerCareWorkerAreaEntity.dong;
  }
  public id: number;
  public city: string;
  public gu: string;
  public dong: string;
}
