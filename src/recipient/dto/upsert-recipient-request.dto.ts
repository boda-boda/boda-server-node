import { IsBoolean, IsInt, IsString } from 'class-validator';

export default class UpsertRecipientRequest {
  public id: string;

  @IsString()
  public name: string;

  @IsBoolean()
  public isFemale: boolean;
  public grade: number;

  @IsInt()
  public age: number;
  public phoneNumber: string;
  public profile: string;
  public zipCode: string;
  public address: string;
  public detailAddress: string;
  public familyType: string;
  public description: string;
  public careCenterId: string;
  public hourlyWage: number;
  public note: string;

  @IsString({ each: true })
  public recipientCapabilities: string[];
}
