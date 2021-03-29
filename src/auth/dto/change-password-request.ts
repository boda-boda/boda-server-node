import { IsNotEmpty, IsString } from 'class-validator';

export default class ChangePasswordRequest {
  @IsNotEmpty()
  @IsString()
  public password: string;

  @IsNotEmpty()
  @IsString()
  public newPassword: string;
}
