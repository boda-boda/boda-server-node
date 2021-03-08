import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsultEntity } from './consult.entity';
import CreateConsultRequest from './dto/create-consult-request';

@Injectable()
export class ConsultService {
  public constructor(
    @InjectRepository(ConsultEntity)
    private readonly consultRepository: Repository<ConsultEntity>,
  ) {}

  public async createConsult(createConsultRequest: CreateConsultRequest) {
    const newConsult = this.consultRepository.create(createConsultRequest);
    newConsult.isFinished = false;

    return this.consultRepository.save(newConsult);
  }

  public async getAllConsults() {
    return await this.consultRepository.find();
  }

  public async finishConsultById(consultId: number) {
    const targetConsult = await this.consultRepository.findOne({
      where: {
        id: consultId,
      },
    });

    targetConsult.isFinished = true;
    return this.consultRepository.save(targetConsult);
  }
}
