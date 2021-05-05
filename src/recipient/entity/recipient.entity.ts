import { CareCenterEntity } from 'src/care-center/care-center.entity';
import { Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base';
import { RecipientMetaEntity } from './recipient-meta.entity';
import { MatchingProposalEntity } from 'src/matching-proposal/matching-proposal.entity';

@Entity('recipient')
export class RecipientEntity extends BaseEntity {
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
    type: 'int',
    nullable: false,
  })
  public grade: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  public age: number;

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
    type: 'varchar',
    length: 255,
  })
  public familyType: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  public religion: string;

  @Column({
    type: 'text',
  })
  public description: string;

  @Column({
    type: 'text',
  })
  public note: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public careCenterId: string;

  @ManyToOne(() => CareCenterEntity, (careCenter) => careCenter.careWorkers, {
    nullable: false,
  })
  @JoinColumn({
    name: 'careCenterId',
    referencedColumnName: 'id',
  })
  public careCenter: CareCenterEntity;

  @OneToMany(() => RecipientMetaEntity, (recipientMeta) => recipientMeta.recipient)
  public recipientMetas: RecipientMetaEntity[];

  @OneToMany(() => MatchingProposalEntity, (matchingProposal) => matchingProposal.careCenter)
  public machingProposals: MatchingProposalEntity[];
}
