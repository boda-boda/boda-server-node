import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CareCenterModule } from './care-center/care-center.module';
import { CareWorkerModule } from './care-worker/care-worker.module';
import { CareWorkerMetaModule } from './care-worker-meta/care-worker-meta.module';
import { CareWorkerScheduleModule } from './care-worker-schedule/care-worker-schedule.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeserializeCareCenterMiddleWare } from './common/middleware/deserialize-care-center.middleware';
import { CareCenterMetaModule } from './care-center-meta/care-center-meta.module';
import { ConsultModule } from './consult/consult.module';
import { AuthModule } from './auth/auth.module';
import { CareWorkerAreaModule } from './care-worker-area/care-worker-area.module';
import { CareWorkerCareerModule } from './care-worker-career/care-worker-career.module';
import { MailModule } from './mail/mail.module';
import { OuterCareWorkerModule } from './outer-care-worker/outer-care-worker.module';
import { RecipientModule } from './recipient/recipient.module';
import { MatchingProposalModule } from './matching-proposal/matching-proposal.module';
import { SmsModule } from './sms/sms.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    CareCenterModule,
    CareWorkerModule,
    CareWorkerMetaModule,
    CareWorkerScheduleModule,
    TypeOrmModule.forRoot(),
    CareCenterMetaModule,
    ConsultModule,
    AuthModule,
    CareWorkerAreaModule,
    CareWorkerCareerModule,
    MailModule,
    OuterCareWorkerModule,
    RecipientModule,
    MatchingProposalModule,
    SmsModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(DeserializeCareCenterMiddleWare).forRoutes('*');
  }
}
