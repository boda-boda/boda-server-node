import CareCenterResponse from 'src/care-center/dto/care-center-response.dto';
import CareWorkerResponse from 'src/care-worker/dto/care-worker-response';
import OuterCareWorkerResponse from 'src/outer-care-worker/dto/outer-care-worker-response.dto';
import { RecipientEntity } from 'src/recipient/entity/recipient.entity';
import { MatchingProposalEntity } from '../matching-proposal.entity';

export default class matchingProposalResponse {
  public constructor(m: MatchingProposalEntity) {
    this.id = m.id;
    this.description = m.description;
    this.careCenter = m.careCenter ? new CareCenterResponse(m.careCenter) : null;
    this.outerCareWorker = m.outerCareWorker
      ? new OuterCareWorkerResponse(m.outerCareWorker)
      : null;
    this.recipient = m.recipient; // ResponseDto가 없슴
  }

  public id: string;
  public description: string;
  public careCenter: CareCenterResponse;
  public outerCareWorker: OuterCareWorkerResponse;
  public recipient: RecipientEntity;
}
