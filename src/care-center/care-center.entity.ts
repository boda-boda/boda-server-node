import { CareCenterMetaEntity } from 'src/care-center-meta/care-center-meta.entity';
import { CareWorkerEntity } from 'src/care-worker/care-worker.entity';
import { BaseEntity } from 'src/common/entity/base';
import { CenterWorkerJoinTableEntity } from 'src/outer-care-worker/entity/center-worker-join-table.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique, OneToOne } from 'typeorm';
import { MatchingProposalEntity } from 'src/matching-proposal/matching-proposal.entity';
import { CreditEntity } from 'src/credit/entity/credit.entity';

@Entity('care-center')
@Unique('UQ_NAME', ['name'])
export class CareCenterEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: 'care-center',
  })
  public type: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  public name: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  public password: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  public username: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: false,
  })
  public phoneNumber: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  public profile: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  public homePage: string;

  @Column({
    type: 'varchar',
    length: 320,
    nullable: true,
    unique: true,
  })
  public email: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  public zipCode: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  public address: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  public detailAddress: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  public description: string;

  @OneToMany(() => CareWorkerEntity, (careWorker) => careWorker.careCenter)
  public careWorkers: CareWorkerEntity[];

  @OneToMany(() => CareCenterMetaEntity, (careCenterMeta) => careCenterMeta.careCenter)
  public careCenterMetas: CareCenterMetaEntity[];

  @OneToMany(
    () => CenterWorkerJoinTableEntity,
    (centerWorkerJoinTable) => centerWorkerJoinTable.careCenter,
  )
  public connectedOuterWorkers: CenterWorkerJoinTableEntity[];

  @OneToMany(() => MatchingProposalEntity, (matchingProposal) => matchingProposal.careCenter)
  public machingProposals: MatchingProposalEntity[];

  @OneToOne(() => CreditEntity, (creditEntity) => creditEntity.careCenter)
  public credit: CreditEntity;
}
