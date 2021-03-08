import { Injectable } from '@nestjs/common';
import { CareCenterEntity } from 'src/care-center/care-center.entity';
import CareCenterResponse from 'src/care-center/dto/care-center-response.dto';
import * as jwt from 'jsonwebtoken';
import Bcrypt from 'src/common/lib/bcrypt';

@Injectable()
export class AuthService {
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
}
