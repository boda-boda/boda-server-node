import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

class CareWorkerRequest {
  @IsNotEmpty()
  public name: string;

  public isFemale: boolean;

  public birthDay: string;

  public phoneNumber: string;

  public workingState: string;

  public licenseDate: string;

  public time: string;

  public profile: string;

  public zipCode: string;

  public address: string;

  public detailAddress: string;

  public description: string;
}

class CareWorkerCareerRequest {
  public place: string;

  public customer: string;

  public duration: string;

  public memo: string;
}

class CareWorkerAreaRequest {
  public city: string;

  public gu: string;

  public dong: string;
}

export class CareWorkerScheduleRequest {
  public days: string[];

  @IsNumber()
  public startHour: number;

  @IsNumber()
  public startMinute: number;

  @IsNumber()
  public endHour: number;

  @IsNumber()
  public endMinute: number;
}

export class CreateCareWorkerRequest {
  public id: string;

  @ValidateNested({ each: true })
  @Type(() => CareWorkerRequest)
  @IsNotEmpty()
  public careWorker: CareWorkerRequest;

  @IsString({ each: true })
  public careWorkerCapabilities: string[];

  @IsString({ each: true })
  public careWorkerReligions: string[];

  @ValidateNested({ each: true })
  @Type(() => CareWorkerScheduleRequest)
  public careWorkerSchedules: CareWorkerScheduleRequest[];

  @ValidateNested({ each: true })
  @Type(() => CareWorkerCareerRequest)
  public careWorkerCareers: CareWorkerCareerRequest[];

  @ValidateNested({ each: true })
  @Type(() => CareWorkerAreaRequest)
  public careWorkerAreas: CareWorkerAreaRequest[];
}
