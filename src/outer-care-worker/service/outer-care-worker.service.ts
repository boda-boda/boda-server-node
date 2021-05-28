import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CareWorkerMetaEntity } from 'src/care-worker-meta/care-worker-meta.entity';
import { CareWorkerCareerEntity } from 'src/care-worker-career/care-worker-career.entity';
import { CareWorkerEntity } from 'src/care-worker/care-worker.entity';
import { CAPABILITY, outerCareWorkerScheduleTypes, RELIGION } from 'src/constant';
import { CreditHistoryEntity } from 'src/credit/entity/credit-history.entity';
import { CreditEntity } from 'src/credit/entity/credit.entity';
import { OuterCareWorkerCareerEntity } from 'src/outer-care-worker/entity/outer-care-worker-career.entity';
import { OuterCareWorkerMetaEntity } from 'src/outer-care-worker/entity/outer-care-worker-meta.entity';
import { getConnection, Repository } from 'typeorm';
import CenterWorkerJoinRequest from '../dto/center-worker-join-request.dto';
import { CreateOuterCareWorkerRequest } from '../dto/create-outer-care-worker-request';
import { OuterCareWorkerConversionResponse } from '../dto/outer-care-worker-conversion-response.dto';
import { CenterWorkerJoinTableEntity } from '../entity/center-worker-join-table.entity';
import { OuterCareWorkerAreaEntity } from '../entity/outer-care-worker-area.entity';
import { OuterCareWorkerEntity } from '../entity/outer-care-worker.entity';
import { WorkerComplimentEntity } from '../entity/worker-compliment.entity';
import { CareWorkerAreaEntity } from 'src/care-worker-area/care-worker-area.entity';

@Injectable()
export class OuterCareWorkerService {
  public constructor(
    @InjectRepository(WorkerComplimentEntity)
    private readonly workerComplimentRepository: Repository<WorkerComplimentEntity>,
    @InjectRepository(CenterWorkerJoinTableEntity)
    private readonly centerWorkerJoinTableRepository: Repository<CenterWorkerJoinTableEntity>,
    @InjectRepository(OuterCareWorkerEntity)
    private readonly outerCareWorkerRepository: Repository<OuterCareWorkerEntity>,
    @InjectRepository(OuterCareWorkerAreaEntity)
    private readonly outerCareWorkerAreaRepository: Repository<OuterCareWorkerAreaEntity>,
    @InjectRepository(OuterCareWorkerCareerEntity)
    private readonly outerCareWorkerCareerRepository: Repository<OuterCareWorkerCareerEntity>,
    @InjectRepository(OuterCareWorkerMetaEntity)
    private readonly outerCareWorkerMetaRepository: Repository<OuterCareWorkerMetaEntity>,
    @InjectRepository(CreditEntity)
    public readonly creditRepository: Repository<CreditEntity>,
    @InjectRepository(CreditHistoryEntity)
    public readonly creditHistoryRepository: Repository<CreditHistoryEntity>,
    @InjectRepository(CareWorkerEntity)
    public readonly careWorkerRepository: Repository<CareWorkerEntity>,
    @InjectRepository(CareWorkerMetaEntity)
    private readonly careWorkerMetaRepository: Repository<CareWorkerMetaEntity>,
    @InjectRepository(CareWorkerCareerEntity)
    private readonly careWorkerCareerRepository: Repository<CareWorkerCareerEntity>,
    @InjectRepository(CareWorkerAreaEntity)
    private readonly careWorkerAreaRepository: Repository<CareWorkerAreaEntity>,
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

  public async getCareWorkerAreaByCareWorkerId(careWorkerId: string) {
    return this.outerCareWorkerAreaRepository.find({
      where: {
        careWorkerId,
      },
    });
  }

  public async deleteAllAreaOfCareWorker(careWorkerId: string) {
    await this.outerCareWorkerAreaRepository.delete({
      careWorkerId,
    });
  }

  public async createAreaOfCareWorker(
    outerCareWorkerArea: Partial<OuterCareWorkerAreaEntity>[],
    outerCareWorkerId: string,
  ) {
    const target = outerCareWorkerArea.map((a) => {
      a.careWorkerId = outerCareWorkerId;
      return a;
    });
    const newOuterCareWorkerArea = this.outerCareWorkerAreaRepository.create(target);
    await this.outerCareWorkerAreaRepository.save(newOuterCareWorkerArea);
  }

  public async updateAreaOfCareWorker(
    careWorkerArea: Partial<OuterCareWorkerAreaEntity>[],
    careWorkerId: string,
  ) {
    const currentArea = await this.outerCareWorkerAreaRepository.find({
      where: { careWorkerId },
    });

    const newArea = careWorkerArea.map((area) => {
      area.careWorkerId = careWorkerId;
      return area;
    });

    const updatedArea = newArea.map((area, idx) => {
      if (currentArea.length > idx) {
        return this.outerCareWorkerAreaRepository.merge(currentArea[idx], area);
      }

      return this.outerCareWorkerAreaRepository.create(area);
    });

    const removedArea = currentArea.splice(newArea.length, currentArea.length - newArea.length);

    if (removedArea.length) await this.outerCareWorkerAreaRepository.remove(removedArea);
    await this.outerCareWorkerAreaRepository.save(updatedArea);
  }

  public async deleteAllCareerOfCareWorker(careWorkerId: string) {
    await this.outerCareWorkerCareerRepository.delete({
      careWorkerId,
    });
  }

  public async createCareWorkerCareer(
    careWorkerCareer: Partial<OuterCareWorkerCareerEntity>[],
    careWorkerId: string,
  ) {
    const target = careWorkerCareer.map((a) => {
      a.careWorkerId = careWorkerId;
      return a;
    });

    const newCareWorkerCareer = this.outerCareWorkerCareerRepository.create(target);
    await this.outerCareWorkerCareerRepository.save(newCareWorkerCareer);
  }

  public async updateCareWorkerCareer(
    careWorkerCareer: Partial<OuterCareWorkerCareerEntity>[],
    careWorkerId: string,
  ) {
    const currentCareWorkerCareer = await this.outerCareWorkerCareerRepository.find({
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
        return this.outerCareWorkerCareerRepository.merge(currentCareWorkerCareer[idx], car);
      }

      return this.outerCareWorkerCareerRepository.create(car);
    });

    const removedCareer = currentCareWorkerCareer.splice(
      newCareWorkerCareer.length,
      currentCareWorkerCareer.length - newCareWorkerCareer.length,
    );

    if (removedCareer.length) await this.outerCareWorkerCareerRepository.remove(removedCareer);
    await this.outerCareWorkerCareerRepository.save(updatedCareer);
  }

  public async deleteAllMetaDataOfCareWorker(careWorkerId: string) {
    await this.outerCareWorkerMetaRepository.delete({
      careWorkerId,
    });
  }

  // 현재 사용되지 않는 메소드 (이슈 있어서 createCapabilityMeta로 이전함)
  public async createCareWorkerMeta(
    careWorkerMetas: Partial<OuterCareWorkerMetaEntity>[],
    careWorkerId: string,
  ) {
    const allMetaEntity = this.outerCareWorkerMetaRepository.create({
      ...careWorkerMetas,
      careWorkerId,
    });

    await this.outerCareWorkerMetaRepository.save(allMetaEntity);
  }

  public async createCapabilityMeta(availabilities: string[], careWorkerId: string) {
    const availableMetaEntity = availabilities.map((a) =>
      this.outerCareWorkerMetaRepository.create({
        type: CAPABILITY,
        key: a,
        careWorkerId,
      }),
    );

    await this.outerCareWorkerMetaRepository.save(availableMetaEntity);
  }

  public async createReligionMeta(religions: string[], careWorkerId: string) {
    const religionMetaEntity = religions.map((a) =>
      this.outerCareWorkerMetaRepository.create({
        type: RELIGION,
        key: a,
        careWorkerId,
      }),
    );

    await this.outerCareWorkerMetaRepository.save(religionMetaEntity);
  }

  public async updateCareWorkerMeta(
    careWokerMetas: Partial<OuterCareWorkerMetaEntity>[],
    careWorkerId: string,
  ) {
    const metas = await this.outerCareWorkerMetaRepository.find({
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
        return this.outerCareWorkerMetaRepository.merge(capabilityMeta[idx], meta);
      }

      return this.outerCareWorkerMetaRepository.create(meta);
    });

    const removedCapabilityMeta = capabilityMeta.splice(
      capabilityMetaRequest.length,
      capabilityMeta.length - capabilityMetaRequest.length,
    );

    if (removedCapabilityMeta.length)
      await this.outerCareWorkerMetaRepository.remove(removedCapabilityMeta);

    const religionMeta = metas.filter((meta) => meta.type === RELIGION);
    const religionMetaRequest = careWokerMetas
      .filter((meta) => meta.type === RELIGION)
      .map((meta) => {
        return { ...meta, careWorkerId };
      });

    const updatedReligionMeta = religionMetaRequest.map((meta, idx) => {
      if (religionMeta.length > idx) {
        return this.outerCareWorkerMetaRepository.merge(religionMeta[idx], meta);
      }

      return this.outerCareWorkerMetaRepository.create(meta);
    });

    const removedReligionMeta = religionMeta.splice(
      religionMetaRequest.length,
      religionMeta.length - religionMetaRequest.length,
    );

    if (removedReligionMeta.length)
      await this.outerCareWorkerMetaRepository.remove(removedReligionMeta);
    await this.outerCareWorkerMetaRepository.save([
      ...updatedReligionMeta,
      ...updatedCapabilityMeta,
    ]);
  }

  public async createOuterCareWorker(cwr: CreateOuterCareWorkerRequest) {
    if (!outerCareWorkerScheduleTypes.includes(cwr.outerCareWorker.schedule)) {
      throw new NotAcceptableException('해당 인자는 입력될 수 없습니다.');
    }

    const ocw = this.outerCareWorkerRepository.create(cwr.outerCareWorker);
    const targetOuterCareWorker = await this.outerCareWorkerRepository.save(ocw);
    await this.createCapabilityMeta(cwr.outerCareWorkerCapabilities, targetOuterCareWorker.id);
    await this.createCareWorkerCareer(cwr.outerCareWorkerCareers, targetOuterCareWorker.id);

    await this.createAreaOfCareWorker(cwr.outerCareWorkerAreas, targetOuterCareWorker.id);
    return targetOuterCareWorker;
  }

  public async createCenterWorkerJoin(ocwid: string, ccid: string) {
    const createCenterWorkerJoinRequest = {
      outerCareWorkerId: ocwid,
      careCenterId: ccid,
    } as CenterWorkerJoinRequest;
    const centerWorkerJoin = this.centerWorkerJoinTableRepository.create(
      createCenterWorkerJoinRequest,
    );
    await this.centerWorkerJoinTableRepository.save(centerWorkerJoin);
    return centerWorkerJoin;
  }

  public getOuterCareWorkerById(id: string) {
    return this.outerCareWorkerRepository.findOne({
      relations: ['outerCareWorkerMetas', 'outerCareWorkerAreas', 'outerCareWorkerCareers'],
      where: {
        id,
        isDeleted: false,
      },
    });
  }

  public getConvertedOuterCareWorkersByCareCenterId(ccid: string) {
    return this.centerWorkerJoinTableRepository.find({
      where: {
        careCenterId: ccid,
      },
    });
  }

  public async convertOuterCareWorker(ocwid: string, ccid: string, usedCredit: number) {
    const createCenterWorkerJoinRequest = {
      outerCareWorkerId: ocwid,
      careCenterId: ccid,
    } as CenterWorkerJoinRequest;

    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    try {
      //center-worker 엔티티에 추가
      const centerWorkerJoin = this.centerWorkerJoinTableRepository.create(
        createCenterWorkerJoinRequest,
      );
      await queryRunner.manager.save(centerWorkerJoin);

      //credit 사용한 만큼 업데이트
      const targetCredit = await this.creditRepository.findOne({
        where: {
          careCenterId: ccid,
        },
      });
      const outerCareWorker = await this.outerCareWorkerRepository.findOne({
        relations: ['outerCareWorkerMetas', 'outerCareWorkerAreas', 'outerCareWorkerCareers'],
        where: {
          id: ocwid,
          isDeleted: false,
        },
      });
      if (targetCredit.careCenterId !== ccid) {
        throw new UnauthorizedException('권한이 없습니다.');
      }

      //History에 얼만큼 썼는지, 누구 전환할 때 썼는지 기록하기 위해 요양보호사 이름 필요
      const creditUseInfo = {
        usedCredit: usedCredit,
        careWorkerName: outerCareWorker.name,
      };

      //Credit 쓴 만큼 차감 (freeCredit부터 차감)
      let updatedCreditRequest;
      if (targetCredit.freeCredit - creditUseInfo.usedCredit >= 0) {
        updatedCreditRequest = {
          ...targetCredit,
          freeCredit: targetCredit.freeCredit - creditUseInfo.usedCredit,
        };
      } else if (
        targetCredit.paidCredit + targetCredit.freeCredit - creditUseInfo.usedCredit >=
        0
      ) {
        updatedCreditRequest = {
          ...targetCredit,
          freeCredit: 0,
          paidCredit: targetCredit.paidCredit + targetCredit.freeCredit - creditUseInfo.usedCredit,
        };
      } else throw new BadRequestException('Not Enough Credit');

      const updatedTargetCredit = this.creditRepository.merge(targetCredit, updatedCreditRequest);
      await queryRunner.manager.save(updatedTargetCredit);

      //credit 사용 내역 creditHistory에 저장
      const creditHistoryRequest = {
        content: `${creditUseInfo.careWorkerName} 요양보호사님 전환`,
        credits: -1 * creditUseInfo.usedCredit,
        type: '사용',
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        creditId: updatedTargetCredit.id,
      };

      const creditHistory = this.creditHistoryRepository.create(creditHistoryRequest);
      await queryRunner.manager.save(creditHistory);

      //해당 외부요양보호사 정보 복사하여 내부요양보호사에 저장
      const outerCareWorkerOnFormat = new OuterCareWorkerConversionResponse(outerCareWorker);

      const newCareWorker = this.careWorkerRepository.create({
        ...outerCareWorkerOnFormat.careWorker,
        careCenterId: ccid,
      });
      await queryRunner.manager.save(newCareWorker);

      const availableMetaEntity = outerCareWorkerOnFormat.careWorkerCapabilities.map((a) =>
        this.careWorkerMetaRepository.create({
          type: CAPABILITY,
          key: a,
          careWorkerId: newCareWorker.id,
        }),
      );
      await queryRunner.manager.save(availableMetaEntity);

      const religionMetaEntity = outerCareWorkerOnFormat.careWorkerReligions?.map((a) =>
        this.careWorkerMetaRepository.create({
          type: RELIGION,
          key: a,
          careWorkerId: newCareWorker.id,
        }),
      );

      await queryRunner.manager.save(religionMetaEntity);

      const targetCareers = outerCareWorkerOnFormat.careWorkerCareers.map((a) => {
        a.careWorkerId = newCareWorker.id;
        return a;
      });

      const newCareWorkerCareer = this.careWorkerCareerRepository.create(targetCareers);

      await queryRunner.manager.save(newCareWorkerCareer);

      const targetAreas = outerCareWorkerOnFormat.careWorkerAreas.map((a) => {
        a.careWorkerId = newCareWorker.id;
        return a;
      });
      const newCareWorkerArea = this.careWorkerAreaRepository.create(targetAreas);

      await queryRunner.manager.save(newCareWorkerArea);

      queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
