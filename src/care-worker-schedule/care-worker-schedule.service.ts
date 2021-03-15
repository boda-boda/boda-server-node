import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CareWorkerScheduleRequest } from 'src/care-worker/dto/create-worker-request';
import { Repository } from 'typeorm';
import { CareWorkerScheduleEntity } from './care-worker-schedule.entity';

@Injectable()
export class CareWorkerScheduleService {
  public constructor(
    @InjectRepository(CareWorkerScheduleEntity)
    private readonly careWorkerScheduleEntity: Repository<CareWorkerScheduleEntity>,
  ) {}

  public async deleteAllScheduleOfCareWorker(careWorkerId: string) {
    await this.careWorkerScheduleEntity.delete({
      careWorkerId,
    });
  }

  public async createCareWorkerSchedule(
    careWorkerScheduleRequests: CareWorkerScheduleRequest[],
    careWorkerId: string,
  ) {
    const allSchedules = careWorkerScheduleRequests.reduce((acc, schedule) => {
      schedule.days.forEach((day) => {
        acc.push({
          day,
          startAt: `${schedule.startHour}:${schedule.startMinute}:00`,
          endAt: `${schedule.endHour}:${schedule.endMinute}:00`,
          careWorkerId,
        });
      });

      return acc;
    }, []);

    await this.careWorkerScheduleEntity.save(allSchedules);
  }
}
