import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareCenterMetaService } from './care-center-meta.service';
import { CareCenterMetaEntity } from './care-center-meta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CareCenterMetaEntity])],
  providers: [CareCenterMetaService],
  exports: [CareCenterMetaService],
})
export class CareCenterMetaModule {}
