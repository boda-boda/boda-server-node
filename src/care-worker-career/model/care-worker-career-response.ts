import { CareWorkerCareerEntity } from '../care-worker-career.entity';

export default class CareWorkerCareerResponse {
  public constructor(careWorkerCareerEntity: CareWorkerCareerEntity) {
    this.id = careWorkerCareerEntity.id;
    this.workplace = careWorkerCareerEntity.workplace;
    this.recipient = careWorkerCareerEntity.recipient;
    this.duration = careWorkerCareerEntity.duration;
  }

  public id: number;
  public workplace: string;
  public recipient: string;
  public duration: string;
}
