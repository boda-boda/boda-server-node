import { IsNotEmpty, IsString } from 'class-validator';

export default class LoginRequestDTO {
  @IsString()
  public name: string;

  @IsString()
  public password: string;
}
