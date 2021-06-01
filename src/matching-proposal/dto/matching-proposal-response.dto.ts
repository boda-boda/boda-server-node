import OuterCareWorkerResponse from 'src/outer-care-worker/dto/outer-care-worker-response.dto';
import { RecipientEntity } from 'src/recipient/entity/recipient.entity';
import { MatchingProposalEntity } from '../matching-proposal.entity';
import { MATCHING_PROPOSAL_STATUS } from '../../constant';
export default class MatchingProposalResponse {
  public constructor(m: MatchingProposalEntity) {
    this.id = m.id;
    this.description = m.description;
    this.outerCareWorker = m.outerCareWorker
      ? new OuterCareWorkerResponse(m.outerCareWorker)
      : null;
    this.recipient = m.recipient; // ResponseDto가 없슴
    this.status =
      m.status === MATCHING_PROPOSAL_STATUS[0]
        ? '대기중'
        : m.status === MATCHING_PROPOSAL_STATUS[1]
        ? '수락됨'
        : '거절됨';
    this.hourlyWage = m.hourlyWage;
    this.securityCode = m.securityCode;
  }
  public id: string;
  public hourlyWage: number;
  public description: string;
  public status: string;
  public outerCareWorker: OuterCareWorkerResponse;
  public recipient: RecipientEntity;
  public securityCode: number;
}
