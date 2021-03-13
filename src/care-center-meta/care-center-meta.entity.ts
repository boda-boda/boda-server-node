import { CareCenterEntity } from 'src/care-center/care-center.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('care-center-meta')
export class CareCenterMetaEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  public type: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  public key: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  public value: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public careCenterId: string;

  @ManyToOne(() => CareCenterEntity, (careCenterEntity) => careCenterEntity.careCenterMetas, {
    nullable: false,
  })
  @JoinColumn({
    name: 'careCenterId',
    referencedColumnName: 'id',
  })
  public careCenter: CareCenterEntity;
}
