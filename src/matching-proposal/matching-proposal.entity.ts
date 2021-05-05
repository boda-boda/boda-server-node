import { CareCenterEntity } from 'src/care-center/care-center.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base';
import { RecipientEntity } from 'src/recipient/entity/recipient.entity';
import { CareWorkerEntity } from 'src/care-worker/care-worker.entity';

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
    nullable: false,
  })
  public careCenterId: string;

  @Column({
    nullable: false,
  })
  public careWorkerId: string;

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

  @ManyToOne(() => CareWorkerEntity, (careWorker) => careWorker.machingProposals, {
    nullable: false,
  })
  @JoinColumn({
    name: 'careWorkerId',
    referencedColumnName: 'id',
  })
  public careWorker: CareWorkerEntity;

  @ManyToOne(() => RecipientEntity, (recipient) => recipient.machingProposals, {
    nullable: false,
  })
  @JoinColumn({
    name: 'recipientId',
    referencedColumnName: 'id',
  })
  public recipient: RecipientEntity;
}
