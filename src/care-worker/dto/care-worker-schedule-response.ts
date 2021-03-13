import { CareWorkerScheduleEntity } from 'src/care-worker-schedule/care-worker-schedule.entity';

export default class CareWorkerScheduleResponse {
  public constructor(careWorkerScheduleEntity: CareWorkerScheduleEntity) {
    this.id = careWorkerScheduleEntity.id;
    this.day = careWorkerScheduleEntity.day;
    this.startAt = careWorkerScheduleEntity.startAt;
    this.endAt = careWorkerScheduleEntity.endAt;
  }

  public id: number;
  public day: string;
  public startAt: string;
  public endAt: string;
}
