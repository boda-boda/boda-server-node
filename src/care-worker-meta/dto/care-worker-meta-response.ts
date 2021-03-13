import { CareWorkerMetaEntity } from '../care-worker-meta.entity';

export default class CareWorkerMetaResponse {
  public constructor(careWorkerMetaEntity: CareWorkerMetaEntity) {
    this.id = careWorkerMetaEntity.id;
    this.type = careWorkerMetaEntity.type;
    this.key = careWorkerMetaEntity.key;
    this.value = careWorkerMetaEntity.value;
  }

  public id: number;
  public type: string;
  public key: string;
  public value: string;
}
