import { OuterCareWorkerEntity } from '../entity/outer-care-worker.entity';

export default class OuterCareWorkerResponse {
  constructor(o: OuterCareWorkerEntity) {
    this.id = o.id;
    this.name = o.name ? o.name[0] + 'XX' : '';
    this.gender = o.isFemale ? '여성' : '남성';
    this.profile = o.profile;
    this.birthDay = o.birthDay;
    this.age = o.birthDay ? new Date().getFullYear() - new Date(o.birthDay).getFullYear() + 1 : 0;
    this.address = o.address;
    this.description = o.description;
    this.schedule = o.schedule;
  }

  public id: string;
  public name: string;
  public gender: string;
  public profile: string;
  public age: number;
  public birthDay: string;
  public address: string;
  public description: string;
  public schedule: string;
}
