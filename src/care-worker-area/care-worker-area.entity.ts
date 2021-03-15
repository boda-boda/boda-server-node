import { CareWorkerEntity } from 'src/care-worker/care-worker.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('care-worker-area')
export class CareWorkerAreaEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public city: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public gu: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public dong: string;

  @Column({
    nullable: false,
  })
  public careWorkerId: string;

  @ManyToOne(() => CareWorkerEntity, (careWorker) => careWorker.careWorkerSchedules, {
    nullable: false,
  })
  @JoinColumn({
    name: 'careWorkerId',
    referencedColumnName: 'id',
  })
  public careWorker: CareWorkerEntity;
}
