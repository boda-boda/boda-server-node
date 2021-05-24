import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { stringList } from 'aws-sdk/clients/datapipeline';
import { FREE_CREDIT_TYPE, PAID_CREDIT_TYPE } from 'src/constant';
import { Repository } from 'typeorm';
import { CreditHistoryEntity } from '../entity/credit-history.entity';
import { CreditEntity } from '../entity/credit.entity';

@Injectable()
export class CreditService {
  public constructor(
    @InjectRepository(CreditEntity)
    public readonly creditRepository: Repository<CreditEntity>,
    @InjectRepository(CreditHistoryEntity)
    public readonly creditHistoryRepository: Repository<CreditHistoryEntity>,
  ) {}

  public async updateCredit(credit: Partial<CreditEntity>, careCenterId: string) {
    const targetCredit = await this.creditRepository.findOne({
      where: {
        careCenterId,
      },
    });

    if (targetCredit.careCenterId !== careCenterId) {
      throw new UnauthorizedException('권한이 없습니다.');
    }

    const updatedCreditRequest = {
      ...credit,
      paidCredit: targetCredit.paidCredit + credit.paidCredit,
      freeCredit: targetCredit.freeCredit + credit.freeCredit,
    };

    const updatedTargetCredit = this.creditRepository.merge(targetCredit, updatedCreditRequest);
    await this.creditRepository.save(updatedTargetCredit);

    return updatedTargetCredit;
  }

  public getCreditById(id: string, careCenterId: string) {
    return this.creditRepository.findOne({
      where: {
        id,
        careCenterId,
      },
    });
  }

  public async createCredit(careCenterId: string) {
    const duplicateCredit = await this.creditRepository.findOne({
      where: { careCenterId },
    });
    if (duplicateCredit) {
      throw new ConflictException(`이미 존재하는 센터의 credit은 생성할 수 없습니다.`);
    }

    const updatedRequest = {
      paidCredit: 0,
      freeCredit: 0,
      careCenterId,
    };

    const Credit = this.creditRepository.create(updatedRequest);
    await this.creditRepository.save(Credit);
    return Credit;
  }
}
