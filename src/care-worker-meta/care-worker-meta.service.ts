import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CAPABILITY, RELIGION } from 'src/constant';
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

  // 현재 사용되지 않는 메소드 (이슈 있어서 createCapabilityMeta로 이전함)
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

  public async createReligionMeta(religions: string[], careWorkerId: string) {
    const religionMetaEntity = religions.map((a) =>
      this.careWorkerMetaRepository.create({
        type: RELIGION,
        key: a,
        careWorkerId,
      }),
    );

    await this.careWorkerMetaRepository.save(religionMetaEntity);
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
      .filter((meta) => meta.type === CAPABILITY)
      .map((meta) => {
        return { ...meta, careWorkerId };
      });

    const updatedCapabilityMeta = capabilityMetaRequest.map((meta, idx) => {
      if (capabilityMeta.length > idx) {
        return this.careWorkerMetaRepository.merge(capabilityMeta[idx], meta);
      }

      return this.careWorkerMetaRepository.create(meta);
    });

    const removedCapabilityMeta = capabilityMeta.splice(
      capabilityMetaRequest.length,
      capabilityMeta.length - capabilityMetaRequest.length,
    );

    if (removedCapabilityMeta.length)
      await this.careWorkerMetaRepository.remove(removedCapabilityMeta);

    const religionMeta = metas.filter((meta) => meta.type === RELIGION);
    const religionMetaRequest = careWokerMetas
      .filter((meta) => meta.type === RELIGION)
      .map((meta) => {
        return { ...meta, careWorkerId };
      });

    const updatedReligionMeta = religionMetaRequest.map((meta, idx) => {
      if (religionMeta.length > idx) {
        return this.careWorkerMetaRepository.merge(religionMeta[idx], meta);
      }

      return this.careWorkerMetaRepository.create(meta);
    });

    const removedReligionMeta = religionMeta.splice(
      religionMetaRequest.length,
      religionMeta.length - religionMetaRequest.length,
    );

    if (removedReligionMeta.length) await this.careWorkerMetaRepository.remove(removedReligionMeta);
    await this.careWorkerMetaRepository.save([...updatedReligionMeta, ...updatedCapabilityMeta]);
  }
}
