import { OuterCareWorkerMetaEntity } from '../entity/outer-care-worker-meta.entity';

export default class OuterCareWorkerMetaResponse {
  public constructor(outerCareWorkerMetaEntity: OuterCareWorkerMetaEntity) {
    this.id = outerCareWorkerMetaEntity.id;
    this.type = outerCareWorkerMetaEntity.type;
    this.key = outerCareWorkerMetaEntity.key;
    this.value = outerCareWorkerMetaEntity.value;
  }

  public id: number;
  public type: string;
  public key: string;
  public value: string;
}
