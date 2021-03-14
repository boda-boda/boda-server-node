import { IsNotEmpty } from 'class-validator';

export default class LoginRequestDTO {
  @IsNotEmpty()
  public readonly name: string;

  @IsNotEmpty()
  public readonly password: string;
}
