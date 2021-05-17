import CareCenterResponse from 'src/care-center/dto/care-center-response.dto';
import CareWorkerResponse from 'src/care-worker/dto/care-worker-response';
import OuterCareWorkerResponse from 'src/outer-care-worker/dto/outer-care-worker-response.dto';
import { RecipientEntity } from 'src/recipient/entity/recipient.entity';
import { MatchingProposalEntity } from '../matching-proposal.entity';

export default class MatchingProposalResponse {
  public constructor(m: MatchingProposalEntity) {
    this.id = m.id;
    this.description = m.description;
    this.outerCareWorker = m.outerCareWorker
      ? new OuterCareWorkerResponse(m.outerCareWorker)
      : null;
    this.recipient = m.recipient; // ResponseDto가 없슴
    this.status = m.status;
    this.hourlyWage = m.hourlyWage;
  }
  public id: string;
  public hourlyWage: number;
  public description: string;
  public status: string;
  public outerCareWorker: OuterCareWorkerResponse;
  public recipient: RecipientEntity;
}
