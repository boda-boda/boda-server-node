import { Module } from '@nestjs/common';
import { SmsModule } from 'src/sms/sms.module';
import { TestController } from './test.controller';

@Module({
  imports: [SmsModule],
  controllers: [TestController],
})
export class TestModule {}
