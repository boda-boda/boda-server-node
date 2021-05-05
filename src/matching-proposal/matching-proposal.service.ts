import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateMatchingProposalRequest from './dto/create-matching-proposal-request.dto';
import { MatchingProposalEntity } from './matching-proposal.entity';

@Injectable()
export class MatchingProposalService {
  public constructor(
    @InjectRepository(MatchingProposalEntity)
    private readonly matchingProposalRespository: Repository<MatchingProposalEntity>,
  ) {}

  public getMatchingProposalById(careCenterId: string, id: string) {
    return this.matchingProposalRespository.findOne({
      relations: ['careWorker', 'careWorker.meta', 'recipient', 'recipient.meta'],
      where: { id, careCenterId },
    });
  }

  public getMatchingProposalsOfCareCenter(careCenterId: string) {
    return this.matchingProposalRespository.find({
      relations: ['careWorker', 'careWorker.meta', 'recipient', 'recipient.meta'],
      where: { careCenterId },
    });
  }

  public createMatchingProposal(
    createMatchingProposalRequest: CreateMatchingProposalRequest,
    careCenterId: string,
  ) {
    const newMatchingProposal = this.matchingProposalRespository.create(
      createMatchingProposalRequest,
    );
    newMatchingProposal.careCenterId = careCenterId;

    return this.matchingProposalRespository.save(newMatchingProposal);
  }
}
