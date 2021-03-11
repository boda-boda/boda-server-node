import { CareCenterEntity } from '../care-center.entity';

export default class CareCenterResponse {
  public constructor(careCenterEntity: CareCenterEntity) {
    this.id = careCenterEntity.id;
    this.type = careCenterEntity.type;
    this.name = careCenterEntity.name;
    this.username = careCenterEntity.username;
    this.phoneNumber = careCenterEntity.phoneNumber;
    this.profile = careCenterEntity.profile;
    this.homePage = careCenterEntity.homePage;
    this.email = careCenterEntity.email;
    this.zipCode = careCenterEntity.zipCode;
    this.address = careCenterEntity.address;
    this.detailAddress = careCenterEntity.detailAddress;
    this.description = careCenterEntity.description;
  }

  public id: string;
  public type: string;
  public name: string;
  public username: string;
  public phoneNumber: string;
  public profile: string;
  public homePage: string;
  public email: string;
  public zipCode: string;
  public address: string;
  public detailAddress: string;
  public description: string;
}
