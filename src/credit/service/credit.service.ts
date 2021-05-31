import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditHistoryEntity } from '../entity/credit-history.entity';
import { CreditEntity } from '../entity/credit.entity';
import UseCreditRequest from '../dto/use-credit-request.dto';
import PaidCreditRequest from '../dto/paid-credit-request.dto';
import FreeCreditRequest from '../dto/free-credit-request.dto';

@Injectable()
export class CreditService {
  public constructor(
    @InjectRepository(CreditEntity)
    public readonly creditRepository: Repository<CreditEntity>,
    @InjectRepository(CreditHistoryEntity)
    public readonly creditHistoryRepository: Repository<CreditHistoryEntity>,
  ) {}

  public async increasePaidCredit(credit: PaidCreditRequest, careCenterId: string) {
    const targetCredit = await this.creditRepository.findOne({
      where: {
        careCenterId,
      },
    });

    if (targetCredit.careCenterId !== careCenterId) {
      throw new UnauthorizedException('권한이 없습니다.');
    }
    const updatedCreditRequest = {
      careCenterId: careCenterId,
      paidCredit: targetCredit.paidCredit + credit.paidCredit,
    };

    const updatedTargetCredit = this.creditRepository.merge(targetCredit, updatedCreditRequest);
    await this.creditRepository.save(updatedTargetCredit);

    const creditHistoryRequest = {
      content: `돌봄 포인트 ${credit.paidCredit}개`,
      credits: credit.paidCredit,
      type: '충전',
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
      creditId: updatedTargetCredit.id,
    };

    const creditHistory = this.creditHistoryRepository.create(creditHistoryRequest);
    await this.creditHistoryRepository.save(creditHistory);

    return updatedTargetCredit;
  }

  public async increaseFreeCredit(credit: FreeCreditRequest, careCenterId: string) {
    const targetCredit = await this.creditRepository.findOne({
      where: {
        careCenterId,
      },
    });

    if (targetCredit.careCenterId !== careCenterId) {
      throw new UnauthorizedException('권한이 없습니다.');
    }
    const updatedCreditRequest = {
      careCenterId: careCenterId,
      freeCredit: targetCredit.freeCredit + credit.freeCredit,
    };

    const updatedTargetCredit = this.creditRepository.merge(targetCredit, updatedCreditRequest);
    await this.creditRepository.save(updatedTargetCredit);

    const creditHistoryRequest = {
      content: `돌봄 포인트 ${credit.freeCredit}개 (${credit.content})`,
      credits: credit.freeCredit,
      type: '지급',
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
      creditId: updatedTargetCredit.id,
    };

    const creditHistory = this.creditHistoryRepository.create(creditHistoryRequest);
    await this.creditHistoryRepository.save(creditHistory);

    return updatedTargetCredit;
  }

  public async useCredit(credit: UseCreditRequest, careCenterId: string) {
    const targetCredit = await this.creditRepository.findOne({
      where: {
        careCenterId,
      },
    });

    if (targetCredit.careCenterId !== careCenterId) {
      throw new UnauthorizedException('권한이 없습니다.');
    }

    let updatedCreditRequest;
    if (targetCredit.freeCredit - credit.usedCredit >= 0) {
      updatedCreditRequest = {
        ...targetCredit,
        freeCredit: targetCredit.freeCredit - credit.usedCredit,
      };
    } else if (targetCredit.paidCredit + targetCredit.freeCredit - credit.usedCredit >= 0) {
      updatedCreditRequest = {
        ...targetCredit,
        freeCredit: 0,
        paidCredit: targetCredit.paidCredit + targetCredit.freeCredit - credit.usedCredit,
      };
    } else throw new BadRequestException('Not Enough Credit');

    const updatedTargetCredit = this.creditRepository.merge(targetCredit, updatedCreditRequest);
    await this.creditRepository.save(updatedTargetCredit);

    const creditHistoryRequest = {
      content: `${credit.careWorkerName} 요양보호사님 전환`,
      credits: -1 * credit.usedCredit,
      type: '사용',
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
      creditId: updatedTargetCredit.id,
    };

    const creditHistory = this.creditHistoryRepository.create(creditHistoryRequest);
    await this.creditHistoryRepository.save(creditHistory);

    return updatedTargetCredit;
  }

  public getCreditByCareCenterId(careCenterId: string) {
    return this.creditRepository.findOne({
      where: {
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

  public getCreditHistoryByCreditId(creditId: number) {
    return this.creditHistoryRepository.find({
      where: {
        creditId,
      },
    });
  }
}
