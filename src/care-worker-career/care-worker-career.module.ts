import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareWorkerCareerEntity } from './care-worker-career.entity';
import { CareWorkerCareerService } from './care-worker-career.service';

@Module({
  imports: [TypeOrmModule.forFeature([CareWorkerCareerEntity])],
  providers: [CareWorkerCareerService],
  exports: [CareWorkerCareerService],
})
export class CareWorkerCareerModule {}
