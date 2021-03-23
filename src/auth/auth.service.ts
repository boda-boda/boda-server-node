import { Injectable } from '@nestjs/common';
import { CareCenterEntity } from 'src/care-center/care-center.entity';
import CareCenterResponse from 'src/care-center/dto/care-center-response.dto';
import * as jwt from 'jsonwebtoken';
import Bcrypt from 'src/common/lib/bcrypt';
import { MailService } from 'src/mail/mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { VerifyEmailEntity } from './verify-email.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

@Injectable()
export class AuthService {
  public constructor(
    @InjectRepository(VerifyEmailEntity)
    private readonly verifyEmailRepository: Repository<VerifyEmailEntity>,

    private readonly mailService: MailService,
  ) {}

  public createAccessToken(careCenterEntity: CareCenterEntity) {
    const careCenterResponseDTO = new CareCenterResponse(careCenterEntity);

    const accessToken = jwt.sign(
      { data: careCenterResponseDTO, timestamp: Date.now() },
      process.env.JWT_ACCESSTOKEN_SECRET,
      {
        expiresIn: '1h',
      },
    );

    return accessToken;
  }

  public createRefreshToken(careCenterEntity: CareCenterEntity) {
    const careCenterResponseDTO = new CareCenterResponse(careCenterEntity);

    const refreshToken = jwt.sign(
      { data: careCenterResponseDTO, timestamp: Date.now() },
      process.env.JWT_ACCESSTOKEN_SECRET,
      {
        expiresIn: '30d',
      },
    );

    return refreshToken;
  }

  public async checkPassword(careCenter: CareCenterEntity, password: string) {
    const isPasswordCorrect = await Bcrypt.compare(password, careCenter.password);

    if (isPasswordCorrect) {
      return true;
    }

    return false;
  }

  public async createPasswordVerificationKey(email: string) {
    const key = v4();

    const newVerifyEmailInstance = this.verifyEmailRepository.create({
      email,
      key,
      isKeyActive: true,
    });

    await this.verifyEmailRepository.save(newVerifyEmailInstance);

    return key;
  }

  public async sendResetPasswordEmail(email: string, key: string) {
    await this.mailService.sendResetPasswordEmail(email, key);
  }
}
