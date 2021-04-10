import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CenterWorkerJoinTableEntity } from '../entity/center-worker-join-table.entity';
import { OuterCareWorkerEntity } from '../entity/outer-care-worker.entity';
import { WorkerComplimentEntity } from '../entity/worker-compliment.entity';

@Injectable()
export class OuterCareWorkerService {
  public constructor(
    @InjectRepository(WorkerComplimentEntity)
    private readonly workerComplimentRepository: Repository<WorkerComplimentEntity>,
    @InjectRepository(CenterWorkerJoinTableEntity)
    private readonly centerWorkerJoinTableRepository: Repository<CenterWorkerJoinTableEntity>,
    @InjectRepository(OuterCareWorkerEntity)
    private readonly outerCareWorkerRepository: Repository<OuterCareWorkerEntity>,
  ) {}

  public addCareWorkerCompliment(careCenterId: string, outerCareWorkerId: string, content: string) {
    const newEntity = this.workerComplimentRepository.create({
      careCenterId,
      outerCareWorkerId,
      content,
    });

    return this.workerComplimentRepository.save(newEntity);
  }

  public findOwnership(careCenterId: string, outerCareWorkerId: string) {
    return this.centerWorkerJoinTableRepository.findOne({
      where: {
        careCenterId,
        outerCareWorkerId,
      },
    });
  }
}
