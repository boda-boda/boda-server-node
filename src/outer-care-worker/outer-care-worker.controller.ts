import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
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
import CreateComplimentRequest from './dto/create-compliment-request.dto';
import { CreateOuterCareWorkerRequest } from './dto/create-outer-care-worker-request';
import SearchRequest from './dto/search-request.dto';
import { OuterCareWorkerService } from './service/outer-care-worker.service';

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
      a.careWorker.name = a.careWorker.name[0] + 'XX';
      a.careWorker.phoneNumber = '010XXXXXXXX';
      a.careWorker.age = a.careWorker.birthDay
        ? new Date().getFullYear() - new Date(a.careWorker.birthDay).getFullYear() + 1
        : 0;
      a.careWorker.gender = a.careWorker.isFemale ? '여성' : '남성';
      a.careWorker.birthDay = Math.floor(a.careWorker.birthDay / 1000) * 1000 + 101;
      return {
        ...a,
        ...a.careWorker,
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
    const result = await this.searchService.searchOuterCareWorkerById(id);

    if (result.body.hits.total.value === 0) {
      throw new NotFoundException('id에 해당하는 careWorker가 존재하지 않습니다.');
    }
    const a = result.body.hits.hits[0]._source;
    a.careWorker.name = a.careWorker.name[0] + 'XX';
    a.careWorker.phoneNumber = '010XXXXXXXX';
    a.careWorker.age = a.careWorker.birthDay
      ? new Date().getFullYear() - new Date(a.careWorker.birthDay).getFullYear() + 1
      : 0;
    a.careWorker.gender = a.careWorker.isFemale ? '여성' : '남성';
    a.careWorker.birthDay = Math.floor(a.careWorker.birthDay / 1000) * 1000 + 101;
    return {
      ...a,
      ...a.careWorker,
    };
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
}
