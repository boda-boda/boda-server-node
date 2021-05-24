import { IsBoolean, IsInt, IsString } from 'class-validator';

export default class UpsertCreditRequest {
  public paidCredit: number;

  public freeCredit: number;

  public careCenterId: string;
}
