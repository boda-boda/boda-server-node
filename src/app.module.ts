import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CareWorkerModule } from './care-worker/care-worker.module';
import { CareWorkerMetaModule } from './care-worker-meta/care-worker-meta.module';
import { CareWorkerScheduleModule } from './care-worker-schedule/care-worker-schedule.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeserializeUserMiddleWare } from './common/middleware/deserialize-user.middleware';

@Module({
  imports: [
    UserModule,
    CareWorkerModule,
    CareWorkerMetaModule,
    CareWorkerScheduleModule,
    TypeOrmModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(DeserializeUserMiddleWare).forRoutes('*');
  }
}
