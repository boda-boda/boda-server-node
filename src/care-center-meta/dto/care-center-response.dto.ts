import { CareCenterMetaEntity } from 'src/care-center-meta/care-center-meta.entity';

export default class CareCenterMetaResponse {
  public constructor(careCenterMetaEntity: CareCenterMetaEntity) {
    this.id = careCenterMetaEntity.id;
    this.value = careCenterMetaEntity.value;
    this.type = careCenterMetaEntity.type;
    this.key = careCenterMetaEntity.key;
  }

  public id: number;
  public value: string;
  public type: string;
  public key: string;
}
