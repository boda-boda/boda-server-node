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

  public async createCapabilityMeta(availabilities: string[], careWorkerId: string) {
    const availableMetaEntity = availabilities.map((a) =>
      this.careWorkerMetaRepository.create({
        type: CAPABILITY,
        key: a,
        careWorkerId,
      }),
    );

    await this.careWorkerMetaRepository.save(availableMetaEntity);
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

    const capabilityMeta = metas.filter((meta) => meta.type === CAPABILITY);
    const capabilityMetaRequest = careWokerMetas
      .map((meta) => {
        return { ...meta, careWorkerId };
      })
      .filter((meta) => meta.type === CAPABILITY);
    const updatedCapabilityMeta = capabilityMetaRequest.map((meta, idx) => {
      if (capabilityMeta.length > idx) {
        return this.careWorkerMetaRepository.merge(capabilityMeta[idx], meta);
      }

      return this.careWorkerMetaRepository.create(meta);
    });

    const removedMeta = capabilityMeta.splice(
      capabilityMetaRequest.length,
      capabilityMeta.length - capabilityMetaRequest.length,
    );

    if (removedMeta.length) await this.careWorkerMetaRepository.remove(removedMeta);
    await this.careWorkerMetaRepository.save(updatedCapabilityMeta);
  }
}
