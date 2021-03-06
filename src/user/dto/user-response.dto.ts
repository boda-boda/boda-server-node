import { UserEntity } from '../user.entity';

export default class UserResponse {
  public constructor(userEntity: UserEntity) {
    this.id = userEntity.id;
    this.type = userEntity.type;
    this.name = userEntity.name;
    this.username = userEntity.username;
    this.phoneNumber = userEntity.phoneNumber;
    this.profile = userEntity.profile;
    this.description = userEntity.description;
  }

  public id: number;
  public type: string;
  public name: string;
  public username: string;
  public phoneNumber: string;
  public profile: string;
  public description: string;
}
