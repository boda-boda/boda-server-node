import { CareCenterEntity } from 'src/care-center/care-center.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base';
import { RecipientEntity } from 'src/recipient/entity/recipient.entity';
import { OuterCareWorkerEntity } from 'src/outer-care-worker/entity/outer-care-worker.entity';
import { MatchingProposalStatus } from '../constant';

@Entity('matching-proposal')
export class MatchingProposalEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  public hourlyWage: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  public description: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    default: 'NOT_READ',
  })
  public status: MatchingProposalStatus; // TODO: 좋은 방법이 없을까요

  @Column({
    nullable: false,
  })
  public careCenterId: string;

  @Column({
    nullable: false,
  })
  public outerCareWorkerId: string;

  @Column({
    nullable: false,
  })
  public recipientId: string;

  @ManyToOne(() => CareCenterEntity, (careCenter) => careCenter.machingProposals, {
    nullable: false,
  })
  @JoinColumn({
    name: 'careCenterId',
    referencedColumnName: 'id',
  })
  public careCenter: CareCenterEntity;

  @ManyToOne(() => OuterCareWorkerEntity, (outerCareWorker) => outerCareWorker.machingProposals, {
    nullable: false,
  })
  @JoinColumn({
    name: 'outerCareWorkerId',
    referencedColumnName: 'id',
  })
  public outerCareWorker: OuterCareWorkerEntity;

  @ManyToOne(() => RecipientEntity, (recipient) => recipient.machingProposals, {
    nullable: false,
  })
  @JoinColumn({
    name: 'recipientId',
    referencedColumnName: 'id',
  })
  public recipient: RecipientEntity;
}
