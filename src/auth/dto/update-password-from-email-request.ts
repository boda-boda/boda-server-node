import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class UpdatePasswordFromEmailRequest {
  @IsNumber()
  @IsNotEmpty()
  public id: number;

  @IsString()
  @IsNotEmpty()
  public password: string;

  @IsString()
  @IsNotEmpty()
  public key: string;
}
