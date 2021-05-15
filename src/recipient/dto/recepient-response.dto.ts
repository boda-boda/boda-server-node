import { RecipientEntity } from '../entity/recipient.entity';

// 지금 당장은 사용되지 않음. 숨길 속성이 없기 때문
export default class RecipientResponse {
  public constructor(r: RecipientEntity) {
    this.id = r.id;
    this.name = r.name;
    this.isFemale = r.isFemale;
    this.grade = r.grade;
    this.age = r.age;
    this.phoneNumber = r.phoneNumber;
    this.profile = r.profile;
    this.zipCode = r.zipCode;
    this.address = r.address;
    this.detailAddress = r.detailAddress;
    this.familyType = r.familyType;
    this.religion = r.religion;
    this.schedule = r.schedule;
    this.description = r.description;
    this.careCenterId = r.careCenterId;
    this.note = r.note;
    this.religion = r.religion;
  }

  public id: string;
  public name: string;
  public isFemale: boolean;
  public grade: number;
  public age: number;
  public phoneNumber: string;
  public profile: string;
  public zipCode: string;
  public address: string;
  public detailAddress: string;
  public familyType: string;
  public religion: string;
  public schedule: string;
  public description: string;
  public careCenterId: string;
  public note: string;
}
