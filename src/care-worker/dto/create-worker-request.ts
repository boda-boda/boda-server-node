import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class KeyPair {
  @IsNotEmpty()
  public key: string;

  public value: string;
}

class BasicWorkerMeta {
  @IsNotEmpty()
  public name: string;

  @IsBoolean()
  public isFemale: boolean;

  @IsNotEmpty()
  public age: number;

  @IsNotEmpty()
  public phoneNumber: string;

  @IsNotEmpty()
  public profile: string;

  @IsNotEmpty()
  public address: string;

  @IsNotEmpty()
  public description: string;

  @IsNotEmpty()
  public careCenterId: string;
}

class ScheduleTableInfo {
  @IsArray({ each: true })
  public Mon: string[][];

  @IsArray({ each: true })
  public Tue: string[][];

  @IsArray({ each: true })
  public Wed: string[][];

  @IsArray({ each: true })
  public Thu: string[][];

  @IsArray({ each: true })
  public Fri: string[][];

  @IsArray({ each: true })
  public Sat: string[][];

  @IsArray({ each: true })
  public Sun: string[][];
}

export default class CreateWorkerRequest {
  public id: string;

  @ValidateNested({ each: true })
  @Type(() => BasicWorkerMeta)
  @IsNotEmpty()
  public basicWorkerState: BasicWorkerMeta;

  @ValidateNested({ each: true })
  @Type(() => KeyPair)
  @IsNotEmpty()
  public capableKeyPair: KeyPair[];

  @ValidateNested({ each: true })
  @Type(() => KeyPair)
  @IsNotEmpty()
  public careerKeyPair: KeyPair[];

  @ValidateNested({ each: true })
  @Type(() => ScheduleTableInfo)
  @IsNotEmpty()
  public scheduleTableInfo: ScheduleTableInfo;

  @IsString({ each: true })
  @IsNotEmpty()
  public regions: string[];
}
