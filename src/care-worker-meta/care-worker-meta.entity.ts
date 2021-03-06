import { CareWorkerEntity } from 'src/care-worker/care-worker.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('care-worker-meta')
export class CareWorkerMetaEntity {
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
    type: 'int',
    nullable: false,
  })
  public careWorkerId: number;

  @ManyToOne((type) => CareWorkerEntity, (careWorker) => careWorker.careWorkerSchedules, {
    nullable: false,
  })
  @JoinColumn({
    name: 'careWorkerId',
    referencedColumnName: 'id',
  })
  public careWorker: CareWorkerEntity;
}
