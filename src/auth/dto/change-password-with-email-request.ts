import { IsEmail, IsNotEmpty } from 'class-validator';

export default class ChangePasswordWithEmailRequest {
  @IsEmail()
  @IsNotEmpty()
  public email: string;
}
