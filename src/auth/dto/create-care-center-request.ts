import { IsEmail, IsNotEmpty } from 'class-validator';

export default class CreateCareCenterRequest {
  @IsNotEmpty()
  public readonly name: string;

  @IsNotEmpty()
  public readonly password: string;

  @IsEmail()
  public readonly email: string;
}
