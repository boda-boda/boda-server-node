import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CAPABILITY } from 'src/constant';
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

  public async createCareWorkerMeta(
    careWorkerMetas: Partial<CareWorkerMetaEntity>[],
    careWorkerId: string,
  ) {
    const allMetaEntity = this.careWorkerMetaRepository.create({
      ...careWorkerMetas,
      careWorkerId,
    });

    await this.careWorkerMetaRepository.save(allMetaEntity);
  }

  public async updateCareWorkerMeta(
    careWokerMetas: Partial<CareWorkerMetaEntity>[],
    careWorkerId: string,
  ) {
    const metas = await this.careWorkerMetaRepository.find({
      where: {
        careWorkerId,
      },
    });

    const availabilityMeta = metas.filter((meta) => meta.type === CAPABILITY);
    const availabilityMetaRequest = careWokerMetas
      .map((meta) => {
        return { ...meta, careWorkerId };
      })
      .filter((meta) => meta.type === CAPABILITY);
    const updatedAvailabilityMeta = availabilityMetaRequest.map((meta, idx) => {
      if (availabilityMeta.length > idx) {
        return this.careWorkerMetaRepository.merge(availabilityMeta[idx], meta);
      }

      return this.careWorkerMetaRepository.create(meta);
    });

    const removedMeta = availabilityMeta.splice(
      availabilityMetaRequest.length,
      availabilityMeta.length - availabilityMetaRequest.length,
    );

    if (removedMeta.length) await this.careWorkerMetaRepository.remove(removedMeta);
    await this.careWorkerMetaRepository.save(updatedAvailabilityMeta);
  }
}
