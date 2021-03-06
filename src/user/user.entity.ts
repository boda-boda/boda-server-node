import { CareWorkerEntity } from 'src/care-worker/care-worker.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: 'user',
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
    length: 50,
    nullable: true,
  })
  public username: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  public password: string;

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
  public description: string;

  @OneToMany(() => CareWorkerEntity, (careWorker) => careWorker.user)
  public careWorkers: CareWorkerEntity[];
}
