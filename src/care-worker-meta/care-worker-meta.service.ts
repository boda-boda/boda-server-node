import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareWorkerMetaEntity } from './care-worker-meta.entity';

@Injectable()
export class CareWorkerMetaService {
  public constructor(
    @InjectRepository(CareWorkerMetaEntity)
    private readonly careWorkerMetaRepository: Repository<CareWorkerMetaEntity>,
  ) {}

  public async deleteAllMetaDataOfCareWorker(careWorkerId: string) {
    await this.careWorkerMetaRepository.delete({
      careWorkerId,
    });
  }

  public async createCareWorkerMeta(careWorkerMetas: Partial<CareWorkerMetaEntity>[]) {
    const allMetaEntity = this.careWorkerMetaRepository.create(careWorkerMetas);
    await this.careWorkerMetaRepository.save(allMetaEntity);
  }
}
