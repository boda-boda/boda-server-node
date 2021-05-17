import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class CareWorkerRequest {
  @IsNotEmpty()
  public name: string;

  public isFemale: boolean;

  public birthDay: string;

  public phoneNumber: string;

  public profile: string;

  public zipCode: string;

  public address: string;

  public detailAddress: string;

  public description: string;

  public licenseDate: string;

  public schedule: string;

  public religion: string;
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

export class CreateOuterCareWorkerRequest {
  public id: string;

  @ValidateNested({ each: true })
  @Type(() => CareWorkerRequest)
  @IsNotEmpty()
  public careWorker: CareWorkerRequest;

  @IsString({ each: true })
  public careWorkerCapabilities: string[];

  @ValidateNested({ each: true })
  @Type(() => CareWorkerCareerRequest)
  public careWorkerCareers: CareWorkerCareerRequest[];

  @ValidateNested({ each: true })
  @Type(() => CareWorkerAreaRequest)
  public careWorkerAreas: CareWorkerAreaRequest[];
}
