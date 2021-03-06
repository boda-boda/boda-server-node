import { Repository } from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as jwt from 'jsonwebtoken';
import CareCenterResponse from './dto/care-center-response.dto';
import { CareCenterEntity } from './care-center.entity';
import Bcrypt from 'src/common/lib/bcrypt';
import CreateCareCenterRequest from './dto/create-care-center-request.dto';

@Injectable()
export class CareCenterService {
  public constructor(
    @InjectRepository(CareCenterEntity)
    public readonly careCenterRepository: Repository<CareCenterEntity>,
  ) {}

  public getCareCenterById(id: number) {
    return this.careCenterRepository.findOne({
      where: {
        id,
      },
    });
  }

  public getCareCenterByName(name: string) {
    return this.careCenterRepository.findOne({ where: { name } });
  }

  public createAccessToken(careCenterEntity: CareCenterEntity) {
    const careCenterResponseDTO = new CareCenterResponse(careCenterEntity);

    const accessToken = jwt.sign(
      { data: careCenterResponseDTO, timestamp: Date.now() },
      process.env.JWT_SECRET,
      {
        expiresIn: Number(process.env.JWT_EXPIRATION),
      },
    );

    return accessToken;
  }

  public async checkPassword(careCenter: CareCenterEntity, password: string) {
    const isPasswordCorrect = await Bcrypt.compare(password, careCenter.password);

    if (isPasswordCorrect) {
      return true;
    }

    return false;
  }

  public async createCareCenter({
    name,
    password,
  }: CreateCareCenterRequest): Promise<CareCenterEntity> {
    const duplicateCareCenter = await this.careCenterRepository.findOne({
      where: {
        name,
      },
    });

    if (duplicateCareCenter) {
      throw new ConflictException(`${name}은 이미 존재하는 회원입니다`);
    }

    const salt = await Bcrypt.createSalt();
    const hashedPassword = await Bcrypt.hash(password, salt);
    const updatedRequest = {
      name,
      salt,
      password: hashedPassword,
      type: 'care-center',
    };

    const CareCenter = this.careCenterRepository.create(updatedRequest);
    await this.careCenterRepository.save(CareCenter);
    return CareCenter;
  }
}
