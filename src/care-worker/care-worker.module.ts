import { Module } from '@nestjs/common';
import { CareWorkerService } from './care-worker.service';
import { CareWorkerController } from './care-worker.controller';
import { CareWorkerMetaModule } from 'src/care-worker-meta/care-worker-meta.module';
import { CareWorkerScheduleModule } from 'src/care-worker-schedule/care-worker-schedule.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareWorkerEntity } from './care-worker.entity';
import { CareWorkerAreaModule } from 'src/care-worker-area/care-worker-area.module';
import { CareWorkerCareerModule } from 'src/care-worker-career/care-worker-career.module';

@Module({
  imports: [
    CareWorkerMetaModule,
    CareWorkerScheduleModule,
    CareWorkerAreaModule,
    CareWorkerCareerModule,
    TypeOrmModule.forFeature([CareWorkerEntity]),
  ],
  controllers: [CareWorkerController],
  providers: [CareWorkerService],
  exports: [CareWorkerService],
})
export class CareWorkerModule {}
