import { CareWorkerMetaEntity } from 'src/care-worker-meta/care-worker-meta.entity';
import { CareWorkerScheduleEntity } from 'src/care-worker-schedule/care-worker-schedule.entity';
import { CareCenterEntity } from 'src/care-center/care-center.entity';
import { CareWorkerAreaEntity } from 'src/care-worker-area/care-worker-area.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CareWorkerCareerEntity } from 'src/care-worker-career/care-worker-career.entity';

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
    type: 'date',
    nullable: false,
  })
  public birthDay: string;

  @Column({
    type: 'boolean',
    nullable: true,
    default: false,
  })
  public isDeleted: boolean;

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

  @OneToMany(() => CareWorkerAreaEntity, (careWorkerArea) => careWorkerArea.careWorker)
  public careWorkerAreas: CareWorkerAreaEntity[];

  @OneToMany(() => CareWorkerCareerEntity, (careWorkerCareer) => careWorkerCareer.careWorker)
  public careWorkerCareers: CareWorkerCareerEntity[];
}
