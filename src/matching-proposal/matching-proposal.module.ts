import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OuterCareWorkerModule } from 'src/outer-care-worker/outer-care-worker.module';
import { RecipientModule } from 'src/recipient/recipient.module';
import { SmsModule } from 'src/sms/sms.module';
import { MatchingProposalController } from './matching-proposal.controller';
import { MatchingProposalEntity } from './matching-proposal.entity';
import { MatchingProposalService } from './matching-proposal.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchingProposalEntity]),
    RecipientModule,
    OuterCareWorkerModule,
    SmsModule,
  ],
  controllers: [MatchingProposalController],
  providers: [MatchingProposalService],
})
export class MatchingProposalModule {}