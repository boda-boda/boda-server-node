import { Repository } from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CareCenterEntity } from './care-center.entity';
import Bcrypt from 'src/common/lib/bcrypt';
import CreateCareCenterRequest from './dto/create-care-center-request.dto';
import LoginRequestDTO from './dto/login-request.dto';

@Injectable()
export class CareCenterService {
  public constructor(
    @InjectRepository(CareCenterEntity)
    public readonly careCenterRepository: Repository<CareCenterEntity>,
  ) {}

  public getCareCenterById(id: string) {
    return this.careCenterRepository.findOne({
      relations: ['careCenterMetas'],
      where: {
        id,
      },
    });
  }

  public getCareCenterByName(name: string) {
    return this.careCenterRepository.findOne({ where: { name } });
  }

  public async createCareCenter({ name, password }: LoginRequestDTO): Promise<CareCenterEntity> {
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

  public async updateCareCenter(careCenterId: string, careCenter: CreateCareCenterRequest) {
    const targetCenter = await this.careCenterRepository.findOne({
      where: {
        id: careCenterId,
      },
    });

    const updatedTargetCenter = this.careCenterRepository.merge(
      targetCenter,
      careCenter.basicCenterState,
    );

    const result = await this.careCenterRepository.save(updatedTargetCenter);

    return result;
  }
}
