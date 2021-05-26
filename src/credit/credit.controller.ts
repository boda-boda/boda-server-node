import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { OnlyAdminGuard } from 'src/common/guard/only-admin.guard';
import { OnlyCareCenterGuard } from 'src/common/guard/only-care-center.guard';
import { SentryInterceptor } from 'src/common/interceptor/sentry.interceptor';
import { getConnection } from 'typeorm';
import FreeCreditRequest from './dto/free-credit-request.dto';
import GetCreditHistoryRequest from './dto/get-credit-history.dto';
import PaidCreditRequest from './dto/paid-credit-request.dto';
import UseCreditRequest from './dto/use-credit-request.dto';
import { CreditService } from './service/credit.service';

@Controller('credit')
@UseInterceptors(SentryInterceptor)
export class CreditController {
  public constructor(private readonly creditService: CreditService) {}

  @Put('/paid-charge')
  @UseGuards(OnlyAdminGuard)
  public async getPaidCredit(
    @Req() request: Request,
    @Body() paidCreditRequest: PaidCreditRequest,
  ) {
    if (!request.careCenter.id) {
      throw new InternalServerErrorException('JWT가 이상합니다.');
    }

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await this.creditService.getPaidCredit(paidCreditRequest, paidCreditRequest.careCenterId);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }
    await queryRunner.release();

    const credit = await this.creditService.getCreditByCareCenterId(paidCreditRequest.careCenterId);

    return credit;
  }

  @Put('/free-charge')
  @UseGuards(OnlyAdminGuard)
  public async getFreeCredit(
    @Req() request: Request,
    @Body() freeCreditRequest: FreeCreditRequest,
  ) {
    if (!request.careCenter.id) {
      throw new InternalServerErrorException('JWT가 이상합니다.');
    }

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await this.creditService.getFreeCredit(freeCreditRequest, freeCreditRequest.careCenterId);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }
    await queryRunner.release();

    const credit = await this.creditService.getCreditByCareCenterId(freeCreditRequest.careCenterId);

    return credit;
  }

  @Put('/use')
  @UseGuards(OnlyCareCenterGuard)
  public async useCredit(@Req() request: Request, @Body() useCreditRequest: UseCreditRequest) {
    if (!request.careCenter.id) {
      throw new InternalServerErrorException('JWT가 이상합니다.');
    }

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await this.creditService.useCredit(useCreditRequest, request.careCenter.id);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }
    await queryRunner.release();
    const credit = await this.creditService.getCreditByCareCenterId(request.careCenter.id);

    return credit;
  }

  @Get('/')
  @UseGuards(OnlyCareCenterGuard)
  public async getCredit(@Req() request: Request) {
    if (!request.careCenter.id) {
      throw new InternalServerErrorException('JWT가 이상합니다.');
    }

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    let credit;
    try {
      credit = await this.creditService.getCreditByCareCenterId(request.careCenter.id);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }

    return credit;
  }

  @Get('/history')
  @UseGuards(OnlyCareCenterGuard)
  public async getCreditHistory(@Req() request: Request) {
    if (!request.careCenter.id) {
      throw new InternalServerErrorException('JWT가 이상합니다.');
    }

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    let result;
    try {
      const credit = await this.creditService.getCreditByCareCenterId(request.careCenter.id);
      result = await this.creditService.getCreditHistoryByCreditId(credit.id);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }

    return result.reverse();
  }
}
