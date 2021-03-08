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

@Module({
  imports: [
    CareCenterModule,
    CareWorkerModule,
    CareWorkerMetaModule,
    CareWorkerScheduleModule,
    TypeOrmModule.forRoot(),
    CareCenterMetaModule,
    ConsultModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(DeserializeCareCenterMiddleWare).forRoutes('*');
  }
}
