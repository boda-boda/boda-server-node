import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { OnlyAdminGuard } from 'src/common/guard/only-admin.guard';
import { OnlyCareCenterGuard } from 'src/common/guard/only-care-center.guard';
import { SentryInterceptor } from 'src/common/interceptor/sentry.interceptor';
import { ValidateIdPipe } from 'src/common/pipe/validate-id.pipe';
import { getConnection } from 'typeorm';
import UpsertCreditRequest from './dto/upsert-credit-request.dto';
import { CreditService } from './service/credit.service';

@Controller('credit')
@UseInterceptors(SentryInterceptor)
export class CreditController {
  public constructor(private readonly creditService: CreditService) {}

  @Put('/')
  @UseGuards(OnlyAdminGuard)
  public async updateCredit(
    @Req() request: Request,
    @Body() upsertCreditRequest: UpsertCreditRequest,
  ) {
    if (!request.careCenter.id) {
      throw new InternalServerErrorException('JWT가 이상합니다.');
    }

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    let result;
    try {
      result = await this.creditService.updateCredit(
        upsertCreditRequest,
        upsertCreditRequest.careCenterId,
      );
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }
    await queryRunner.release();

    const credit = await this.creditService.getCreditById(
      result.id,
      upsertCreditRequest.careCenterId,
    );

    return credit;
  }
}
