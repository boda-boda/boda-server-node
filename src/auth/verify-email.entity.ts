import { BaseEntity } from 'src/common/entity/base';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('verify-email')
export class VerifyEmailEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public key: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
  })
  public isKeyActive: boolean;
}
