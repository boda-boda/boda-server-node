import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareCenterMetaEntity } from './care-center-meta.entity';

@Injectable()
export class CareCenterMetaService {
  public constructor(
    @InjectRepository(CareCenterMetaEntity)
    public readonly careCenterRepository: Repository<CareCenterMetaEntity>,
  ) {}
}
