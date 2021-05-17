import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { outerCareWorkerScheduleTypes } from 'src/constant';
import { Repository } from 'typeorm';
import { CreateOuterCareWorkerRequest } from '../dto/create-outer-care-worker-request';
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

  public createOuterCareWorker(cwr: CreateOuterCareWorkerRequest) {
    if (!outerCareWorkerScheduleTypes.includes(cwr.careWorker.schedule)) {
      throw new NotAcceptableException('해당 인자는 입력될 수 없습니다.');
    }

    const ocw = this.outerCareWorkerRepository.create(cwr.careWorker);
    ocw.metadata = JSON.stringify({
      careWorkerAreas: cwr.careWorkerAreas,
      careWorkerCapabilities: cwr.careWorkerCapabilities,
      careWorkerCareers: cwr.careWorkerCareers,
    });

    return this.outerCareWorkerRepository.save(ocw);
  }

  public getOuterCareWorkerById(id: string) {
    return this.outerCareWorkerRepository.findOne({
      where: {
        id,
      },
    });
  }
}
