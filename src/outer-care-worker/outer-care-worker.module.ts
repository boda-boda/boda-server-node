import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OuterCareWorkerAreaEntity } from 'src/outer-care-worker/entity/outer-care-worker-area.entity';
import { SearchModule } from 'src/search/search.module';
import { CenterWorkerJoinTableEntity } from './entity/center-worker-join-table.entity';
import { OuterCareWorkerEntity } from './entity/outer-care-worker.entity';
import { WorkerComplimentEntity } from './entity/worker-compliment.entity';
import { OuterCareWorkerController } from './outer-care-worker.controller';
import { OuterCareWorkerService } from './service/outer-care-worker.service';
import { OuterCareWorkerCareerEntity } from 'src/outer-care-worker/entity/outer-care-worker-career.entity';
import { OuterCareWorkerMetaEntity } from 'src/outer-care-worker/entity/outer-care-worker-meta.entity';
import { CreditModule } from 'src/credit/credit.module';
import { CareWorkerModule } from 'src/care-worker/care-worker.module';
import { CreditEntity } from 'src/credit/entity/credit.entity';
import { CreditHistoryEntity } from 'src/credit/entity/credit-history.entity';
import { CareWorkerEntity } from 'src/care-worker/care-worker.entity';
import { CareWorkerMetaModule } from 'src/care-worker-meta/care-worker-meta.module';
import { CareWorkerAreaModule } from 'src/care-worker-area/care-worker-area.module';
import { CareWorkerCareerModule } from 'src/care-worker-career/care-worker-career.module';
import { CareWorkerMetaEntity } from 'src/care-worker-meta/care-worker-meta.entity';
import { CareWorkerCareerEntity } from 'src/care-worker-career/care-worker-career.entity';
import { CareWorkerAreaEntity } from 'src/care-worker-area/care-worker-area.entity';

@Module({
  imports: [
    SearchModule,
    TypeOrmModule.forFeature([
      OuterCareWorkerAreaEntity,
      OuterCareWorkerCareerEntity,
      OuterCareWorkerMetaEntity,
      OuterCareWorkerEntity,
      WorkerComplimentEntity,
      CenterWorkerJoinTableEntity,
      CreditEntity,
      CreditHistoryEntity,
      CareWorkerEntity,
      CareWorkerMetaEntity,
      CareWorkerCareerEntity,
      CareWorkerAreaEntity,
    ]),
  ],
  controllers: [OuterCareWorkerController],
  providers: [OuterCareWorkerService],
  exports: [OuterCareWorkerService],
})
export class OuterCareWorkerModule {}
