import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultController } from './consult.controller';
import { ConsultEntity } from './consult.entity';
import { ConsultService } from './consult.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConsultEntity])],
  controllers: [ConsultController],
  providers: [ConsultService],
})
export class ConsultModule {}
