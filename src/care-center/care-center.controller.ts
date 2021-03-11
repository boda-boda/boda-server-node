import {
  Body,
  Controller,
  Get,
  Header,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CareWorkerService } from 'src/care-worker/care-worker.service';
import CareWorkerResponse from 'src/care-worker/dto/care-worker-response';
import { OnlyAdminGuard } from 'src/common/guard/only-admin.guard';
import { OnlyCareCenterGuard } from 'src/common/guard/only-care-center.guard';
import { ValidateIdPipe } from 'src/common/pipe/validate-id.pipe';
import { getConnection } from 'typeorm';
import { CareCenterService } from './care-center.service';
import CareCenterResponse from './dto/care-center-response.dto';
import CreateCareCenterRequest from './dto/create-care-center-request.dto';

@Controller('care-center')
export class CareCenterController {
  public constructor(
    private readonly careCenterService: CareCenterService,
    private readonly careWorkerService: CareWorkerService,
  ) {}

  @Get('/:careCenterId/care-worker')
  @UseGuards(OnlyAdminGuard)
  public async getCareWorkersByCareCenterId(
    @Param('careCenterId', ValidateIdPipe) careCenterId: string,
  ) {
    const careWorkers = await this.careWorkerService.getCareWorkersByCareCenterId(careCenterId);

    return careWorkers.map((c) => new CareWorkerResponse(c));
  }

  @Get('hello')
  public async getTest() {
    const careCenter = await this.careCenterService.getCareCenterById(
      '59fdb9bd-4e45-46e5-ac68-fcef3ad9b614',
    );
    return careCenter;
  }

  @Get('/')
  @Header('Cache-control', 'no-cache, no-store, must-revalidate')
  @UseGuards(OnlyCareCenterGuard)
  public async getCareCenterDetail(@Req() request: Request) {
    const careCenter = await this.careCenterService.getCareCenterById(request.careCenter.id);
    return new CareCenterResponse(careCenter);
  }

  @Post('/')
  @Header('Cache-control', 'no-cache, no-store, must-revalidate')
  @UseGuards(OnlyCareCenterGuard)
  public async updateCareCenter(@Req() request: Request, @Body() body: CreateCareCenterRequest) {
    if (!request.careCenter.id) {
      throw new InternalServerErrorException('JWT가 이상합니다.');
    }

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    let result;
    try {
      result = await this.careCenterService.updateCareCenter(request.careCenter.id, body);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }
    await queryRunner.release();

    const careCenter = await this.careCenterService.getCareCenterById(result.id);

    return new CareCenterResponse(careCenter);
  }
}
