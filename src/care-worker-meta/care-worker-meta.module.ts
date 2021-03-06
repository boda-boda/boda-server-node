import { Module } from '@nestjs/common';
import { CareWorkerMetaService } from './care-worker-meta.service';

@Module({
  providers: [CareWorkerMetaService],
  exports: [CareWorkerMetaService],
})
export class CareWorkerMetaModule {}
