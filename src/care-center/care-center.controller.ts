import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CareWorkerService } from 'src/care-worker/care-worker.service';
import CareWorkerResponse from 'src/care-worker/dto/care-worker-response';
import { OnlyAdminGuard } from 'src/common/guard/only-admin.guard';
import { ValidateIdPipe } from 'src/common/pipe/validate-id.pipe';
import { CareCenterService } from './care-center.service';

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
}
