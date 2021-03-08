import { CareCenterEntity } from '../care-center.entity';

export default class CareCenterResponse {
  public constructor(careCenterEntity: CareCenterEntity) {
    this.id = careCenterEntity.id;
    this.type = careCenterEntity.type;
    this.name = careCenterEntity.name;
    this.username = careCenterEntity.username;
    this.phoneNumber = careCenterEntity.phoneNumber;
    this.profile = careCenterEntity.profile;
    this.description = careCenterEntity.description;
  }

  public id: string;
  public type: string;
  public name: string;
  public username: string;
  public phoneNumber: string;
  public profile: string;
  public description: string;
}
