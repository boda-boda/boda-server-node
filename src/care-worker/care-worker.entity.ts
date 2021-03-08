import { CareWorkerMetaEntity } from 'src/care-worker-meta/care-worker-meta.entity';
import { CareWorkerScheduleEntity } from 'src/care-worker-schedule/care-worker-schedule.entity';
import { CareCenterEntity } from 'src/care-center/care-center.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('care-worker')
export class CareWorkerEntity {
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
  })
  public address: string;

  @Column({
    type: 'text',
  })
  public description: string;

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

  @OneToMany(() => CareWorkerMetaEntity, (careWorkerMeta) => careWorkerMeta.careWorker)
  public careWorkerMetas: CareWorkerMetaEntity[];

  @OneToMany(() => CareWorkerScheduleEntity, (careWorkerSchedule) => careWorkerSchedule.careWorker)
  public careWorkerSchedules: CareWorkerScheduleEntity[];
}
