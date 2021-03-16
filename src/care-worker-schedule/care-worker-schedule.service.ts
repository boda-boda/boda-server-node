import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CareWorkerScheduleRequest } from 'src/care-worker/dto/create-worker-request';
import { toTimeString } from 'src/common/lib/time';
import { Repository } from 'typeorm';
import { CareWorkerScheduleEntity } from './care-worker-schedule.entity';

@Injectable()
export class CareWorkerScheduleService {
  public constructor(
    @InjectRepository(CareWorkerScheduleEntity)
    private readonly careWorkerScheduleRepository: Repository<CareWorkerScheduleEntity>,
  ) {}

  public async deleteAllScheduleOfCareWorker(careWorkerId: string) {
    await this.careWorkerScheduleRepository.delete({
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

    await this.careWorkerScheduleRepository.save(allSchedules);
  }

  public async updateCareWorkerSchedule(
    careWorkerScheduleRequests: CareWorkerScheduleRequest[],
    careWorkerId: string,
  ) {
    const currentSchedule = await this.careWorkerScheduleRepository.find({
      where: { careWorkerId },
    });

    const newSchedule = careWorkerScheduleRequests.reduce((acc, schedule) => {
      schedule.days.forEach((day) => {
        acc.push({
          day,
          startAt: `${toTimeString(schedule.startHour)}:${toTimeString(schedule.startMinute)}:00`,
          endAt: `${toTimeString(schedule.endHour)}:${toTimeString(schedule.endMinute)}:00`,
          careWorkerId,
        });
      });

      return acc;
    }, [] as Partial<CareWorkerScheduleEntity>[]);

    const updatedSchedule = newSchedule.map((sche, idx) => {
      if (currentSchedule.length > idx) {
        return this.careWorkerScheduleRepository.merge(currentSchedule[idx], sche);
      }
      return this.careWorkerScheduleRepository.create(sche);
    });

    const removedSchedule = currentSchedule.splice(
      newSchedule.length,
      currentSchedule.length - newSchedule.length,
    );
    if (removedSchedule.length) await this.careWorkerScheduleRepository.remove(removedSchedule);
    await this.careWorkerScheduleRepository.save(updatedSchedule);
  }
}
