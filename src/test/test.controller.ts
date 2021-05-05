import { Controller, Param, Post } from '@nestjs/common';
import { SmsService } from 'src/sms/sms.service';

@Controller('test')
export class TestController {
  public constructor(private readonly smsService: SmsService) {}

  @Post('/:phoneNumber')
  public async sendMessage(@Param('phoneNumber') phoneNumber: string) {
    this.smsService.sendMessage(phoneNumber);
  }
}
