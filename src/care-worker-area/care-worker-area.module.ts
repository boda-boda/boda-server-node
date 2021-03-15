import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareWorkerAreaEntity } from './care-worker-area.entity';
import { CareWorkerAreaService } from './care-worker-area.service';

@Module({
  imports: [TypeOrmModule.forFeature([CareWorkerAreaEntity])],
  providers: [CareWorkerAreaService],
  exports: [CareWorkerAreaService],
})
export class CareWorkerAreaModule {}
