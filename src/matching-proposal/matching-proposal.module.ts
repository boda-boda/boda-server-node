import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OuterCareWorkerEntity } from 'src/outer-care-worker/entity/outer-care-worker.entity';
import { OuterCareWorkerModule } from 'src/outer-care-worker/outer-care-worker.module';
import { RecipientMetaEntity } from 'src/recipient/entity/recipient-meta.entity';
import { RecipientEntity } from 'src/recipient/entity/recipient.entity';
import { RecipientModule } from 'src/recipient/recipient.module';
import { SmsModule } from 'src/sms/sms.module';
import { MatchingProposalController } from './matching-proposal.controller';
import { MatchingProposalEntity } from './matching-proposal.entity';
import { MatchingProposalService } from './matching-proposal.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MatchingProposalEntity,
      OuterCareWorkerEntity,
      RecipientEntity,
      RecipientMetaEntity,
    ]),
    RecipientModule,
    OuterCareWorkerModule,
    SmsModule,
  ],
  controllers: [MatchingProposalController],
  providers: [MatchingProposalService],
})
export class MatchingProposalModule {}
