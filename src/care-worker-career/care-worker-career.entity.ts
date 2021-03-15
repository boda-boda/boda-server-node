import { CareWorkerEntity } from 'src/care-worker/care-worker.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('care-worker-career')
export class CareWorkerCareerEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public workplace: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public recipient: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public duration: string;

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
