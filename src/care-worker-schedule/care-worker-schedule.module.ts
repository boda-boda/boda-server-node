import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareWorkerScheduleEntity } from './care-worker-schedule.entity';
import { CareWorkerScheduleService } from './care-worker-schedule.service';

@Module({
  imports: [TypeOrmModule.forFeature([CareWorkerScheduleEntity])],
  providers: [CareWorkerScheduleService],
  exports: [CareWorkerScheduleService],
})
export class CareWorkerScheduleModule {}
