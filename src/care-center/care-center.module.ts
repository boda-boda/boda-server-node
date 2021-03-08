import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareCenterMetaModule } from 'src/care-center-meta/care-center-meta.module';
import { CareWorkerModule } from 'src/care-worker/care-worker.module';
import { CareCenterController } from './care-center.controller';
import { CareCenterEntity } from './care-center.entity';
import { CareCenterService } from './care-center.service';

@Module({
  imports: [TypeOrmModule.forFeature([CareCenterEntity]), CareWorkerModule, CareCenterMetaModule],
  controllers: [CareCenterController],
  providers: [CareCenterService],
  exports: [CareCenterService],
})
export class CareCenterModule {}
