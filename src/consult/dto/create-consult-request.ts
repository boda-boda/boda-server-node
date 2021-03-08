import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateConsultRequest {
  @IsString()
  @IsNotEmpty()
  public contact: string;
}
