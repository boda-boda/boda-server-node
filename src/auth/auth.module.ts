import { Module } from '@nestjs/common';
import { CareCenterModule } from 'src/care-center/care-center.module';
import { MailModule } from 'src/mail/mail.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [CareCenterModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
