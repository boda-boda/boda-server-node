import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('care-center-meta')
export class CareCenterMetaEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  public key: string;
}
