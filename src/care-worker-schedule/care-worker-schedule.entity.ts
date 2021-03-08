import { CareWorkerEntity } from 'src/care-worker/care-worker.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('care-worker-schedule')
export class CareWorkerScheduleEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'text',
  })
  public day: string;

  @Column({
    type: 'time',
    nullable: false,
  })
  public startAt: string;

  @Column({
    type: 'time',
    nullable: false,
  })
  public endAt: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  public careWorkerId: string;

  @ManyToOne((type) => CareWorkerEntity, (careWorker) => careWorker.careWorkerSchedules, {
    nullable: false,
  })
  @JoinColumn({
    name: 'careWorkerId',
    referencedColumnName: 'id',
  })
  public careWorker: CareWorkerEntity;
}
