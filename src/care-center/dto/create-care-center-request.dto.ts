import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, ValidateNested } from 'class-validator';

class BasicCenterInfo {
  @IsNotEmpty()
  public username: string;

  @IsNotEmpty()
  public phoneNumber: string;

  @IsNotEmpty()
  public profile: string;

  @IsNotEmpty()
  public homePage: string;

  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  public zipCode: string;

  @IsNotEmpty()
  public address: string;

  @IsNotEmpty()
  public detailAddress: string;

  @IsNotEmpty()
  public description: string;
}

export default class CreateCareCenterRequest {
  @ValidateNested({ each: true })
  @Type(() => BasicCenterInfo)
  @IsNotEmpty()
  public basicCenterState: BasicCenterInfo;
}
