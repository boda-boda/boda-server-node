import { IsNumber, IsString } from 'class-validator';

export default class CreateMatchingProposalRequest {
  @IsNumber()
  public hourlyWage: number;

  public description: string;

  @IsString()
  public careWorkerId: string;

  @IsString()
  public recipientId: string;
}
