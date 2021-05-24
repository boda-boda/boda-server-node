import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareCenterModule } from 'src/care-center/care-center.module';
import { CreditModule } from 'src/credit/credit.module';
import { MailModule } from 'src/mail/mail.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { VerifyEmailEntity } from './verify-email.entity';

@Module({
  imports: [
    CareCenterModule,
    CreditModule,
    MailModule,
    TypeOrmModule.forFeature([VerifyEmailEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
