import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditController } from './credit.controller';
import { CreditHistoryEntity } from './entity/credit-history.entity';
import { CreditEntity } from './entity/credit.entity';
import { CreditService } from './service/credit.service';

@Module({
  imports: [TypeOrmModule.forFeature([CreditEntity, CreditHistoryEntity])],
  controllers: [CreditController],
  providers: [CreditService],
  exports: [CreditService],
})
export class CreditModule {}
