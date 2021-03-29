import { Repository } from 'typeorm';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CareCenterEntity } from './care-center.entity';
import Bcrypt from 'src/common/lib/bcrypt';
import UpdateCareCenterRequest from './dto/update-care-center-request.dto';
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
        isDeleted: false,
      },
    });
  }

  public getCareCenterByName(name: string) {
    return this.careCenterRepository.findOne({ where: { name, isDeleted: false } });
  }

  public async createCareCenter({ name, password }: LoginRequestDTO): Promise<CareCenterEntity> {
    const duplicateCareCenter = await this.careCenterRepository.findOne({
      where: { name, isDeleted: false },
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

  public async updatePassword(password: string, careCenterId: string) {
    const targetCareCenter = await this.careCenterRepository.findOne({
      where: { id: careCenterId, isDeleted: false },
    });

    if (!targetCareCenter) {
      throw new NotFoundException('해당 CareCenter가 존재하지 않습니다.');
    }

    const salt = await Bcrypt.createSalt();
    const hashedPassword = await Bcrypt.hash(password, salt);

    targetCareCenter.password = hashedPassword;
    await this.careCenterRepository.save(targetCareCenter);
  }

  public async updateCareCenter(careCenterId: string, careCenter: UpdateCareCenterRequest) {
    const targetCenter = await this.careCenterRepository.findOne({
      where: { id: careCenterId, isDeleted: false },
    });

    const updatedTargetCenter = this.careCenterRepository.merge(targetCenter, careCenter);

    const result = await this.careCenterRepository.save(updatedTargetCenter);

    return result;
  }

  public async findCareCenterByEmail(email: string) {
    return await this.careCenterRepository.findOne({ where: { email, isDeleted: false } });
  }
}
