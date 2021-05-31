import { CareCenterEntity } from 'src/care-center/care-center.entity';
import { BaseEntity } from 'src/common/entity/base';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreditHistoryEntity } from './credit-history.entity';

@Entity('credit')
export class CreditEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  public paidCredit: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  public freeCredit: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public careCenterId: string;

  @OneToOne(() => CareCenterEntity, (careCenterEntity) => careCenterEntity.credit, {
    nullable: false,
  })
  @JoinColumn({
    name: 'careCenterId',
    referencedColumnName: 'id',
  })
  public careCenter: CareCenterEntity;

  @OneToMany(() => CreditHistoryEntity, (creditHistory) => creditHistory.credit)
  public creditHistorys: CreditHistoryEntity[];
}
