import { IsEmail, IsNotEmpty } from 'class-validator';

export default class ChangePasswordRequest {
  @IsEmail()
  @IsNotEmpty()
  public email: string;
}
