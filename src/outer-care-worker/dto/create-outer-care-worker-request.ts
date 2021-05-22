import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class OuterCareWorkerRequest {
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

class OuterCareWorkerCareerRequest {
  public workplace: string;

  public recipient: string;

  public duration: string;
}

class OuterCareWorkerAreaRequest {
  public city: string;

  public gu: string;

  public dong: string;
}

export class CreateOuterCareWorkerRequest {
  public id: string;

  @ValidateNested({ each: true })
  @Type(() => OuterCareWorkerRequest)
  @IsNotEmpty()
  public outerCareWorker: OuterCareWorkerRequest;

  @IsString({ each: true })
  public outerCareWorkerCapabilities: string[];

  @ValidateNested({ each: true })
  @Type(() => OuterCareWorkerCareerRequest)
  public outerCareWorkerCareers: OuterCareWorkerCareerRequest[];

  @ValidateNested({ each: true })
  @Type(() => OuterCareWorkerAreaRequest)
  public outerCareWorkerAreas: OuterCareWorkerAreaRequest[];
}
