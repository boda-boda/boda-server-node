import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchModule } from 'src/search/search.module';
import { CenterWorkerJoinTableEntity } from './entity/center-worker-join-table.entity';
import { OuterCareWorkerEntity } from './entity/outer-care-worker.entity';
import { WorkerComplimentEntity } from './entity/worker-compliment.entity';
import { OuterCareWorkerController } from './outer-care-worker.controller';
import { OuterCareWorkerService } from './service/outer-care-worker.service';

@Module({
  imports: [
    SearchModule,
    TypeOrmModule.forFeature([
      OuterCareWorkerEntity,
      WorkerComplimentEntity,
      CenterWorkerJoinTableEntity,
    ]),
  ],
  controllers: [OuterCareWorkerController],
  providers: [OuterCareWorkerService],
  exports: [OuterCareWorkerService],
})
export class OuterCareWorkerModule {}
