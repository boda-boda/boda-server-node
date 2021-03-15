import { CareWorkerAreaEntity } from '../care-worker-area.entity';

export default class CareWorkerAreaResponse {
  public constructor(careWorkerAreaEntity: CareWorkerAreaEntity) {
    this.id = careWorkerAreaEntity.id;
    this.city = careWorkerAreaEntity.city;
    this.gu = careWorkerAreaEntity.gu;
    this.dong = careWorkerAreaEntity.dong;
  }
  public id: number;
  public city: string;
  public gu: string;
  public dong: string;
}
