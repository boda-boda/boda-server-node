import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base';
import { CenterWorkerJoinTableEntity } from './center-worker-join-table.entity';
import { MatchingProposalEntity } from 'src/matching-proposal/matching-proposal.entity';
import { OuterCareWorkerMetaEntity } from 'src/outer-care-worker/entity/outer-care-worker-meta.entity';
import { OuterCareWorkerAreaEntity } from 'src/outer-care-worker/entity/outer-care-worker-area.entity';
import { OuterCareWorkerCareerEntity } from 'src/outer-care-worker/entity/outer-care-worker-career.entity';

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
    type: 'date',
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

  @OneToMany(
    () => CenterWorkerJoinTableEntity,
    (centerWorkerJointable) => centerWorkerJointable.outerCareWorker,
  )
  public connectedCenters: CenterWorkerJoinTableEntity[];

  @OneToMany(
    () => OuterCareWorkerMetaEntity,
    (outerCareWorkerMeta) => outerCareWorkerMeta.outerCareWorker,
  )
  public outerCareWorkerMetas: OuterCareWorkerMetaEntity[];

  @OneToMany(
    () => OuterCareWorkerAreaEntity,
    (outerCareWorkerArea) => outerCareWorkerArea.outerCareWorker,
  )
  public outerCareWorkerAreas: OuterCareWorkerAreaEntity[];

  @OneToMany(
    () => OuterCareWorkerCareerEntity,
    (outerCareWorkerCareer) => outerCareWorkerCareer.outerCareWorker,
  )
  public outerCareWorkerCareers: OuterCareWorkerCareerEntity[];

  @OneToMany(() => MatchingProposalEntity, (matchingProposal) => matchingProposal.outerCareWorker)
  public machingProposals: MatchingProposalEntity[];
}
