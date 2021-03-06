import { IsBoolean, IsNotEmpty, IsSemVer, IsString, ValidateNested } from 'class-validator';

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
  public careCenterId: number;
}

class ScheduleTableInfo {
  public Mon: string[][];
  public Tue: string[][];
  public Wed: string[][];
  public Thu: string[][];
  public Fri: string[][];
  public Sat: string[][];
  public Sun: string[][];
}

export default class CreateWorkerRequest {
  public id: number;

  @ValidateNested()
  public basicWorkerState: BasicWorkerMeta;

  @IsString({ each: true })
  public selectedPersonalities: string[];

  @ValidateNested()
  public capableKeyPair: KeyPair[];

  @ValidateNested()
  public careerKeyPair: KeyPair[];

  @ValidateNested()
  public scheduleTableInfo: ScheduleTableInfo;

  @IsString({ each: true })
  public regions: string[];
}
