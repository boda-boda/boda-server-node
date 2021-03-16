import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareWorkerCareerEntity } from './care-worker-career.entity';

@Injectable()
export class CareWorkerCareerService {
  public constructor(
    @InjectRepository(CareWorkerCareerEntity)
    private readonly careWorkerCareerEntity: Repository<CareWorkerCareerEntity>,
  ) {}

  public async deleteAllCareerOfCareWorker(careWorkerId: string) {
    await this.careWorkerCareerEntity.delete({
      careWorkerId,
    });
  }

  public async createCareWorkerCareer(
    careWorkerCareer: Partial<CareWorkerCareerEntity>[],
    careWorkerId: string,
  ) {
    const target = careWorkerCareer.map((a) => {
      a.careWorkerId = careWorkerId;
      return a;
    });

    const newCareWorkerCareer = this.careWorkerCareerEntity.create(target);
    await this.careWorkerCareerEntity.save(newCareWorkerCareer);
  }

  public async updateCareWorkerCareer(
    careWorkerCareer: Partial<CareWorkerCareerEntity>[],
    careWorkerId: string,
  ) {
    const currentCareWorkerCareer = await this.careWorkerCareerEntity.find({
      where: {
        careWorkerId,
      },
    });

    const newCareWorkerCareer = careWorkerCareer.map((a) => {
      a.careWorkerId = careWorkerId;
      return a;
    });

    const updatedCareer = newCareWorkerCareer.map((car, idx) => {
      if (currentCareWorkerCareer.length > idx) {
        return this.careWorkerCareerEntity.merge(currentCareWorkerCareer[idx], car);
      }

      return this.careWorkerCareerEntity.create(car);
    });

    const removedCareer = currentCareWorkerCareer.splice(
      newCareWorkerCareer.length,
      currentCareWorkerCareer.length - newCareWorkerCareer.length,
    );

    if (removedCareer.length) await this.careWorkerCareerEntity.remove(removedCareer);
    await this.careWorkerCareerEntity.save(updatedCareer);
  }
}
