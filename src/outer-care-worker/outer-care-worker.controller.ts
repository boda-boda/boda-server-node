import { Body, Controller, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CreateWorkerRequest } from 'src/care-worker/dto/create-worker-request';
import { OnlyAdminGuard } from 'src/common/guard/only-admin.guard';
import { OnlyCareCenterGuard } from 'src/common/guard/only-care-center.guard';
import { SearchService } from 'src/search/search.service';
import CreateComplimentRequest from './dto/create-compliment-request.dto';
import { OuterCareWorkerService } from './service/outer-care-worker.service';

@Controller('outer-care-worker')
export class OuterCareWorkerController {
  public constructor(
    private readonly outerCareWorkerService: OuterCareWorkerService,
    private readonly searchService: SearchService,
  ) {}

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
  public async createOuterCareWorker(@Body() body: CreateWorkerRequest) {
    // TODO : 시간 데이터 어떻게 해야 검색 잘되는지 알아보기
    await this.searchService.createOuterCareWorker(body);
  }

  // @Post('')
  // @UseGuards(OnlyCareCenterGuard)
  // public async searchOuterCareWorker(@Body() body: any) {}
}
