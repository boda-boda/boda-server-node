import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipientMetaEntity } from './entity/recipient-meta.entity';
import { RecipientEntity } from './entity/recipient.entity';
import { RecipientController } from './recipient.controller';
import { RecipientService } from './recipient.service';

@Module({
  imports: [TypeOrmModule.forFeature([RecipientEntity, RecipientMetaEntity])],
  controllers: [RecipientController],
  providers: [RecipientService],
})
export class RecipientModule {}
