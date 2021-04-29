import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RecipientEntity } from './recipient.entity';

@Entity('recipient-meta')
export class RecipientMetaEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  public type: string;

  @Column({
    type: 'text',
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
  public recipientId: string;

  @ManyToOne(() => RecipientEntity, (recipient) => recipient.recipientMetas, {
    nullable: false,
  })
  @JoinColumn({
    name: 'recipientId',
    referencedColumnName: 'id',
  })
  public recipient: RecipientEntity;
}
