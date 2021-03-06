import { IsNotEmpty } from 'class-validator';

export default class CreateCareCenterRequest {
  @IsNotEmpty()
  public readonly name: string;

  @IsNotEmpty()
  public readonly password: string;
}
