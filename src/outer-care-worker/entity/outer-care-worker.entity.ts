import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base';
import { CenterWorkerJoinTableEntity } from './center-worker-join-table.entity';
import { MatchingProposalEntity } from 'src/matching-proposal/matching-proposal.entity';

@Entity('outer-care-worker')
export class OuterCareWorkerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  public name: string;

  @Column({
    type: 'bool',
    nullable: false,
  })
  public isFemale: boolean;

  @Column({
    type: 'date',
    nullable: true,
  })
  public birthDay: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: false,
  })
  public phoneNumber: string;

  @Column({
    type: 'text',
  })
  public profile: string;

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
  })
  public description: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  public licenseDate: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  public schedule: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  public religion: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  public metadata: string;

  @OneToMany(
    () => CenterWorkerJoinTableEntity,
    (centerWorkerJointable) => centerWorkerJointable.outerCareWorker,
  )
  public connectedCenters: CenterWorkerJoinTableEntity[];

  @OneToMany(() => MatchingProposalEntity, (matchingProposal) => matchingProposal.outerCareWorker)
  public machingProposals: MatchingProposalEntity[];
}
