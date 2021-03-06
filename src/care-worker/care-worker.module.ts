import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { CareWorkerService } from './care-worker.service';
import { CareWorkerController } from './care-worker.controller';
import { CareWorkerMetaModule } from 'src/care-worker-meta/care-worker-meta.module';
import { CareWorkerScheduleModule } from 'src/care-worker-schedule/care-worker-schedule.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareWorkerEntity } from './care-worker.entity';
import { CareWorkerMetaEntity } from 'src/care-worker-meta/care-worker-meta.entity';
import { CareWorkerScheduleEntity } from 'src/care-worker-schedule/care-worker-schedule.entity';

@Module({
  imports: [
    CareWorkerMetaModule,
    CareWorkerScheduleModule,
    TypeOrmModule.forFeature([CareWorkerEntity, CareWorkerMetaEntity, CareWorkerScheduleEntity]),
  ],
  controllers: [CareWorkerController],
  providers: [CareWorkerService],
  exports: [CareWorkerService],
})
export class CareWorkerModule {}
