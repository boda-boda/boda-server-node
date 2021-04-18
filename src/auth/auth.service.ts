import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

  public async createPasswordVerificationKey(targetCenter: CareCenterEntity) {
    const key = v4();

    const newVerifyEmailInstance = this.verifyEmailRepository.create({
      careCenterId: targetCenter.id,
      email: targetCenter.email,
      key,
      isKeyActive: true,
      deadline: new Date(Date.now() + 1000 * 60 * 5).toISOString(), // 만료 기한 5분으로 설정
    });

    const verifyEmailEntity = await this.verifyEmailRepository.save(newVerifyEmailInstance);

    return verifyEmailEntity;
  }

  public sendResetPasswordEmail(id: number, email: string, key: string) {
    return this.mailService.sendResetPasswordEmail(id, email, key);
  }

  public async validateResetPasswordEmail(id: number, key: string) {
    const verifyEmailEntity = await this.verifyEmailRepository.findOne({
      where: {
        id,
        key,
      },
    });

    if (!verifyEmailEntity) {
      throw new UnauthorizedException('올바르지 않은 요청입니다.');
    }

    return verifyEmailEntity;
  }

  public setVerifyEmailEntityExpired(verifyEmailEntity: VerifyEmailEntity) {
    verifyEmailEntity.isKeyActive = false;
    return this.verifyEmailRepository.save(verifyEmailEntity);
  }
}
