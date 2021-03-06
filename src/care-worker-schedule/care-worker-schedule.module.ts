import { Module } from '@nestjs/common';
import { CareWorkerScheduleService } from './care-worker-schedule.service';

@Module({
  providers: [CareWorkerScheduleService],
  exports: [CareWorkerScheduleService],
})
export class CareWorkerScheduleModule {}
