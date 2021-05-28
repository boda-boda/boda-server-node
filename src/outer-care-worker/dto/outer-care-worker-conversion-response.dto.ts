import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CareWorkerAreaEntity } from 'src/care-worker-area/care-worker-area.entity';
import { CareWorkerCareerEntity } from 'src/care-worker-career/care-worker-career.entity';
import OuterCareWorkerAreaResponse from 'src/outer-care-worker/dto/outer-care-worker-area-response';
import OuterCareWorkerCareerResponse from 'src/outer-care-worker/dto/outer-care-worker-career-response';
import OuterCareWorkerMetaResponse from 'src/outer-care-worker/dto/outer-care-worker-meta-response';
import { OuterCareWorkerEntity } from '../entity/outer-care-worker.entity';

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
  public workplace: string;

  public customer: string;

  public duration: string;

  public memo: string;
}

class CareWorkerAreaRequest {
  public city: string;

  public gu: string;

  public dong: string;
}

export class OuterCareWorkerConversionResponse {
  constructor(o: OuterCareWorkerEntity) {
    this.id = o.id;
    this.careWorker = {
      name: o.name,
      isFemale: o.isFemale,
      birthDay: o.birthDay,
      phoneNumber: o.phoneNumber,
      workingState: '',
      licenseDate: o.licenseDate,
      time: o.schedule ? o.schedule : '',
      profile: o.profile,
      zipCode: o.zipCode,
      address: o.address,
      detailAddress: o.detailAddress,
      description: o.description,
    };
    this.careWorkerCapabilities = o.outerCareWorkerMetas.reduce((acc, cur) => {
      acc.push(cur.key);
      return acc;
    }, []);
    this.careWorkerReligions = o.religion ? [o.religion] : ([] as string[]);
    this.careWorkerCareers = o.outerCareWorkerCareers.reduce((acc, cur) => {
      acc.push({
        workplace: cur.workplace,
        customer: cur.recipient,
        duration: cur.duration,
        memo: cur.memo,
      } as Partial<CareWorkerCareerEntity>);
      return acc;
    }, []);
    this.careWorkerAreas = o.outerCareWorkerAreas.reduce((acc, cur) => {
      acc.push({
        city: cur.city,
        gu: cur.gu,
        dong: cur.dong,
      } as Partial<CareWorkerAreaEntity>);
      return acc;
    }, []);
  }

  public id: string;

  @ValidateNested({ each: true })
  @Type(() => CareWorkerRequest)
  @IsNotEmpty()
  public careWorker: CareWorkerRequest;

  @IsString({ each: true })
  public careWorkerCapabilities: string[];

  @IsString({ each: true })
  public careWorkerReligions: string[];

  // @ValidateNested({ each: true })
  // @Type(() => CareWorkerScheduleRequest)
  // public careWorkerSchedules: CareWorkerScheduleRequest[];

  @ValidateNested({ each: true })
  @Type(() => CareWorkerCareerRequest)
  public careWorkerCareers: Partial<CareWorkerCareerEntity>[];

  @ValidateNested({ each: true })
  @Type(() => CareWorkerAreaRequest)
  public careWorkerAreas: Partial<CareWorkerAreaEntity>[];
}
