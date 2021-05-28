import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { OnlyAdminGuard } from 'src/common/guard/only-admin.guard';
import { OnlyCareCenterGuard } from 'src/common/guard/only-care-center.guard';
import { SentryInterceptor } from 'src/common/interceptor/sentry.interceptor';
import { SearchService } from 'src/search/search.service';
import { getConnection } from 'typeorm';
import ConvertOuterCareWorkerRequest from './dto/convert-outer-care-worker-request.dto';
import CreateComplimentRequest from './dto/create-compliment-request.dto';
import { CreateOuterCareWorkerRequest } from './dto/create-outer-care-worker-request';
import { OuterCareWorkerConversionResponse } from './dto/outer-care-worker-conversion-response.dto';
import OuterCareWorkerResponse from './dto/outer-care-worker-response.dto';
import SearchRequest from './dto/search-request.dto';
import { OuterCareWorkerService } from './service/outer-care-worker.service';
import { CREDITS_ON_CONVERSION } from 'src/constant';

@Controller('outer-care-worker')
@UseInterceptors(SentryInterceptor)
export class OuterCareWorkerController {
  public constructor(
    private readonly outerCareWorkerService: OuterCareWorkerService,
    private readonly searchService: SearchService,
  ) {}

  @Get('/search')
  @UseGuards(OnlyCareCenterGuard)
  public async searchOuterCareWorker(@Query() searchRequest: SearchRequest) {
    if (typeof searchRequest.capabilities === 'string') {
      searchRequest.capabilities = [searchRequest.capabilities];
    }

    if (typeof searchRequest.religions === 'string') {
      searchRequest.religions = [searchRequest.religions];
    }

    const result = await this.searchService.searchOuterCareWorker(searchRequest);

    const total = result.body.hits.total.value;
    const data = result.body.hits.hits.map((a) => a._source);
    const filteredData = data.map((a) => {
      const birthDayOnFormat = a.outerCareWorker.birthDay
        ? a.outerCareWorker.birthDay.toString().slice(0, 4) +
          '-' +
          a.outerCareWorker.birthDay.toString().slice(4, 6) +
          '-' +
          a.outerCareWorker.birthDay.toString().slice(6, 8)
        : 0;
      a.outerCareWorker.name = a.outerCareWorker.name[0] + 'XX';
      a.outerCareWorker.phoneNumber = '010XXXXXXXX';
      a.outerCareWorker.age = a.outerCareWorker.birthDay
        ? new Date().getFullYear() - new Date(birthDayOnFormat).getFullYear() + 1
        : 0;
      a.outerCareWorker.gender = a.outerCareWorker.isFemale ? '여성' : '남성';
      a.outerCareWorker.birthDay = Math.floor(a.outerCareWorker.birthDay / 1000) * 1000 + 101;
      return {
        ...a,
        ...a.outerCareWorker,
      };
    });

    return {
      total,
      page: searchRequest.from / searchRequest.size + 1,
      size: filteredData.length,
      data: filteredData,
    };
  }

  @Get('/:id')
  @UseGuards(OnlyCareCenterGuard)
  public async getOuterCareWorkerById(@Param('id') id: string) {
    const outerCareWorker = await this.outerCareWorkerService.getOuterCareWorkerById(id);
    return new OuterCareWorkerResponse(outerCareWorker);
  }

  @Get('/conversion/:id')
  @UseGuards(OnlyCareCenterGuard)
  public async getOuterCareWorkerForConversionById(@Param('id') id: string) {
    const outerCareWorker = await this.outerCareWorkerService.getOuterCareWorkerById(id);
    return new OuterCareWorkerConversionResponse(outerCareWorker);
  }

  @Post('/compliment')
  @UseGuards(OnlyCareCenterGuard)
  public async createCareWorkerCompliment(
    @Req() request: Request,
    @Body() { outerCareWorkerId, content }: CreateComplimentRequest,
  ) {
    const careCenterId = request.careCenter.id;
    const ownership = await this.outerCareWorkerService.findOwnership(
      careCenterId,
      outerCareWorkerId,
    );

    if (!ownership) {
      throw new UnauthorizedException('권한이 없습니다.');
    }

    await this.outerCareWorkerService.addCareWorkerCompliment(
      careCenterId,
      outerCareWorkerId,
      content,
    );
  }

  @Post('')
  @UseGuards(OnlyAdminGuard)
  public async createOuterCareWorker(@Body() body: CreateOuterCareWorkerRequest) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    // TODO : 시간 데이터 어떻게 해야 검색 잘되는지 알아보기
    try {
      const createdCareWorker = await this.outerCareWorkerService.createOuterCareWorker(body);
      const ocw = await this.searchService.createOuterCareWorker(body, createdCareWorker.id);
      if (ocw.statusCode >= 400) {
        throw new BadRequestException(`Create Error: ${ocw.body}`);
      }
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }
    await queryRunner.release();
  }

  @Post('/conversion')
  @UseGuards(OnlyCareCenterGuard)
  public async createCenterWorkerJoin(
    @Req() request: Request,
    @Body() body: { outerCareWorkerId: string },
  ) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await this.outerCareWorkerService.createCenterWorkerJoin(
        body.outerCareWorkerId,
        request.careCenter.id,
      );
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }
    await queryRunner.release();
  }

  // @Post('/convert')
  // @UseGuards(OnlyCareCenterGuard)
  // public async convertOuterCareWorker(
  //   @Req() request: Request,
  //   @Body() convertOuterCareWorkerRequest: ConvertOuterCareWorkerRequest,
  // ) {
  //   const queryRunner = getConnection().createQueryRunner();
  //   await queryRunner.startTransaction();

  //   try {
  //     this.outerCareWorkerService.createCenterWorkerJoin(
  //       convertOuterCareWorkerRequest.outerCareWorkerId,
  //       request.careCenter.id,
  //     );
  //     const outerCareWorker = await this.outerCareWorkerService.getOuterCareWorkerById(
  //       convertOuterCareWorkerRequest.outerCareWorkerId,
  //     );

  //     const outerCareWorkerOnFormat = new OuterCareWorkerConversionResponse(outerCareWorker);

  //     const useCreditRequest = {
  //       usedCredit: convertOuterCareWorkerRequest.usedCredit,
  //       careWorkerName: outerCareWorker.name,
  //     };

  //     this.creditService.useCredit(useCreditRequest, request.careCenter.id);
  //     const createWorkerRequest = {
  //       careWorker: outerCareWorkerOnFormat.careWorker,
  //       careWorkerAreas: outerCareWorkerOnFormat.careWorkerAreas,
  //       careWorkerCapabilities: outerCareWorkerOnFormat.careWorkerCapabilities,
  //       careWorkerCareers: outerCareWorkerOnFormat.careWorkerCareers,
  //       careWorkerReligions: outerCareWorkerOnFormat.careWorkerReligions,
  //     } as CreateCareWorkerRequest;
  //     this.careWorkerService.createCareWorker(request.careCenter.id, createWorkerRequest);
  //     await queryRunner.commitTransaction();
  //   } catch (e) {
  //     await queryRunner.rollbackTransaction();
  //     throw e;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  @Post('/convert')
  @UseGuards(OnlyCareCenterGuard)
  public async convertOuterCareWorker(
    @Req() request: Request,
    @Body() convertOuterCareWorkerRequest: ConvertOuterCareWorkerRequest,
  ) {
    return await this.outerCareWorkerService.convertOuterCareWorker(
      convertOuterCareWorkerRequest.outerCareWorkerId,
      request.careCenter.id,
      CREDITS_ON_CONVERSION,
    );
  }

  @Get('/id/converted')
  @UseGuards(OnlyCareCenterGuard)
  public async getConvertedOuterCareWorkersIds(@Req() request: Request) {
    const convertedOuterCareWorkers =
      await this.outerCareWorkerService.getConvertedOuterCareWorkersByCareCenterId(
        request.careCenter.id,
      );
    const convertedOuterCareWorkersIdArray = convertedOuterCareWorkers.reduce((acc, cur) => {
      acc.push(cur.outerCareWorkerId);
      return acc;
    }, []);
    return convertedOuterCareWorkersIdArray;
  }
}
