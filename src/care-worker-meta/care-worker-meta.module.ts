import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareWorkerMetaEntity } from './care-worker-meta.entity';
import { CareWorkerMetaService } from './care-worker-meta.service';

@Module({
  imports: [TypeOrmModule.forFeature([CareWorkerMetaEntity])],
  providers: [CareWorkerMetaService],
  exports: [CareWorkerMetaService],
})
export class CareWorkerMetaModule {}
