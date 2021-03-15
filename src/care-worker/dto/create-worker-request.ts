import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class CareWorkerRequest {
  @IsNotEmpty()
  public name: string;

  public isFemale: boolean;

  public age: number;

  public phoneNumber: string;

  public profile: string;

  public address: string;

  public description: string;
}

class CareWorkerCareerRequest {
  public place: string;

  public customer: string;

  public duration: string;
}

class CareWorkerAreaRequest {
  public city: string;

  public gu: string;

  public dong: string;
}

export class CareWorkerScheduleRequest {
  public days: string[];

  public startHour: number;

  public startMinute: number;

  public endHour: number;

  public endMinute: number;
}

export class CreateWorkerRequest {
  public id: string;

  @ValidateNested({ each: true })
  @Type(() => CareWorkerRequest)
  @IsNotEmpty()
  public careWorker: CareWorkerRequest;

  @IsString({ each: true })
  public careWorkerCapabilities: string[];

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
