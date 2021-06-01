import { IsNumber, IsString } from 'class-validator';

export default class CreateMatchingProposalRequest {
  @IsNumber()
  public hourlyWage: number;

  public description: string;

  @IsString()
  public outerCareWorkerId: string;

  @IsString()
  public recipientId: string;

  public securityCode: number;
}
