import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareWorkerAreaEntity } from './care-worker-area.entity';

@Injectable()
export class CareWorkerAreaService {
  public constructor(
    @InjectRepository(CareWorkerAreaEntity)
    private readonly careWorkerAreaRepository: Repository<CareWorkerAreaEntity>,
  ) {}

  public async getCareWorkerAreaByCareWorkerId(careWorkerId: string) {
    return this.careWorkerAreaRepository.find({
      where: {
        careWorkerId,
      },
    });
  }

  public async deleteAllAreaOfCareWorker(careWorkerId: string) {
    await this.careWorkerAreaRepository.delete({
      careWorkerId,
    });
  }

  public async createAreaOfCareWorker(
    careWorkerArea: Partial<CareWorkerAreaEntity>[],
    careWorkerId: string,
  ) {
    const target = careWorkerArea.map((a) => {
      a.careWorkerId = careWorkerId;
      return a;
    });
    const newCareWorkerArea = this.careWorkerAreaRepository.create(target);
    await this.careWorkerAreaRepository.save(newCareWorkerArea);
  }

  public async updateAreaOfCareWorker(
    careWorkerArea: Partial<CareWorkerAreaEntity>[],
    careWorkerId: string,
  ) {
    const currentArea = await this.careWorkerAreaRepository.find({
      where: { careWorkerId },
    });

    const newArea = careWorkerArea.map((area) => {
      area.careWorkerId = careWorkerId;
      return area;
    });

    const updatedArea = newArea.map((area, idx) => {
      if (currentArea.length > idx) {
        return this.careWorkerAreaRepository.merge(currentArea[idx], area);
      }

      return this.careWorkerAreaRepository.create(area);
    });

    const removedArea = currentArea.splice(newArea.length, currentArea.length - newArea.length);

    if (removedArea.length) await this.careWorkerAreaRepository.remove(removedArea);
    await this.careWorkerAreaRepository.save(updatedArea);
  }
}
