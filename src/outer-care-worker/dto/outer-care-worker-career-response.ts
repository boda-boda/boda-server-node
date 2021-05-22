import { OuterCareWorkerCareerEntity } from '../entity/outer-care-worker-career.entity';

export default class OuterCareWorkerCareerResponse {
  public constructor(outerCareWorkerCareerEntity: OuterCareWorkerCareerEntity) {
    this.id = outerCareWorkerCareerEntity.id;
    this.workplace = outerCareWorkerCareerEntity.workplace;
    this.recipient = outerCareWorkerCareerEntity.recipient;
    this.duration = outerCareWorkerCareerEntity.duration;
    this.memo = outerCareWorkerCareerEntity.memo;
  }

  public id: number;
  public workplace: string;
  public recipient: string;
  public duration: string;
  public memo: string;
}
