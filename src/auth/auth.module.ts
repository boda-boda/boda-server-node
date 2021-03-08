import { Module } from '@nestjs/common';
import { CareCenterModule } from 'src/care-center/care-center.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [CareCenterModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
