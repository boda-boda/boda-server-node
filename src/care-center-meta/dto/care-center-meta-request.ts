import { IsNotEmpty } from 'class-validator';

export default class CreateCareCenterMetaRequest {
  public id: number;

  @IsNotEmpty()
  public type: string;

  @IsNotEmpty()
  public key: string;

  @IsNotEmpty()
  public value: string;

  @IsNotEmpty()
  public careCenterId: string;
}
