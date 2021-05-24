import { CareCenterEntity } from 'src/care-center/care-center.entity';
import { BaseEntity } from 'src/common/entity/base';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreditEntity } from './credit.entity';

@Entity('credit-history')
export class CreditHistoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  public content: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  public credits: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public type: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public date: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public creditId: string;

  @ManyToOne(() => CreditEntity, (creditEntity) => creditEntity.creditHistorys, {
    nullable: false,
  })
  @JoinColumn({
    name: 'creditId',
    referencedColumnName: 'id',
  })
  public credit: CreditEntity;
}
