import { BaseEntity } from 'src/common/entity/base';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('consult')
export class ConsultEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  public contact: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  public isFinished: boolean;
}
