import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { request, Request } from 'express';
import { CareWorkerMetaService } from 'src/care-worker-meta/care-worker-meta.service';
import { CareWorkerScheduleService } from 'src/care-worker-schedule/care-worker-schedule.service';
import { OnlyUserGuard } from 'src/common/guard/only-user.guard';
import { ValidateIdPipe } from 'src/common/pipe/validate-id.pipe';
import { getConnection } from 'typeorm';
import { CareWorkerService } from './care-worker.service';
import CareWorkerResponse from './dto/care-worker-response';
import CreateWorkerRequest from './dto/create-worker-request';

@Controller('care-worker')
export class CareWorkerController {
  public constructor(
    private readonly careWorkerService: CareWorkerService,
    private readonly careWorkerMetaService: CareWorkerMetaService,
    private readonly careWorkerScheduleService: CareWorkerScheduleService,
  ) {}

  @Get('/:id')
  @Header('Cache-control', 'no-cache, no-store, must-revalidate')
  @UseGuards(OnlyUserGuard)
  public async getCareWorkerDetail(@Param('id', ValidateIdPipe) id: number) {
    const careWorker = await this.careWorkerService.getCareWorkerById(id);

    return new CareWorkerResponse(careWorker);
  }

  @Post('/:id/profile')
  @Header('Cache-control', 'no-cache, no-store, must-revalidate')
  @UseGuards(OnlyUserGuard)
  @UseInterceptors(FileInterceptor('image'))
  public async uploadProfile(@UploadedFile() file, @Param('id', ValidateIdPipe) id: number) {
    return await this.careWorkerService.uploadProfileImage(id, file);
  }

  @Post('/profile')
  @Header('Cache-control', 'no-cache, no-store, must-revalidate')
  @UseGuards(OnlyUserGuard)
  @UseInterceptors(FileInterceptor('image'))
  public async uploadImage(@UploadedFile() file) {
    return await this.careWorkerService.uploadImage(file);
  }

  @Get('/')
  @Header('Cache-control', 'no-cache, no-store, must-revalidate')
  @UseGuards(OnlyUserGuard)
  public async getCareWorkerOfUser(@Req() request: Request) {
    if (!request.user.id) {
      throw new InternalServerErrorException('JWT가 이상합니다.');
    }

    const careWorkers = await this.careWorkerService.getCareWorkersByUserId(request.user.id);

    return careWorkers.map((c) => new CareWorkerResponse(c));
  }

  @Post('/')
  @Header('Cache-control', 'no-cache, no-store, must-revalidate')
  @UseGuards(OnlyUserGuard)
  public async upsertCareWorker(@Req() request: Request, @Body() body: CreateWorkerRequest) {
    if (!request.user.id) {
      throw new InternalServerErrorException('JWT가 이상합니다.');
    }

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    let result;
    try {
      if (!body.id) {
        //insert
        result = await this.careWorkerService.createCareWorker(request.user.id, body);
      } else {
        result = await this.careWorkerService.updateCareWorker(request.user.id, body);
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }
    await queryRunner.release();

    const careWorker = await this.careWorkerService.getCareWorkerById(result.id);

    return new CareWorkerResponse(careWorker);
  }

  @Delete('/:id')
  @Header('Cache-control', 'no-cache, no-store, must-revalidate')
  @UseGuards(OnlyUserGuard)
  public async deleteCareWorker(@Req() request, @Param('id', ValidateIdPipe) id: number) {
    if (!this.careWorkerService.isThisWorkerIsMine(request.user.id, id)) {
      throw new UnauthorizedException('삭제 권한이 없습니다.');
    }

    await this.careWorkerService.deleteCareWorker(id);

    return;
  }
}
