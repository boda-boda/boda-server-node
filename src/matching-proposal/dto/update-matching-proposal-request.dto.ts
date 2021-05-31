import { MatchingProposalStatus } from 'src/constant';

export default class UpdateMatchingProposalRequest {
  public id: string;

  public status: MatchingProposalStatus;
}
