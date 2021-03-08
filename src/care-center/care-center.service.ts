import { Repository } from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
