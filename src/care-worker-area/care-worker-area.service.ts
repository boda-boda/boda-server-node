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
}
