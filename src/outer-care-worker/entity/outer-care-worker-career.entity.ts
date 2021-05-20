import { CareWorkerEntity } from 'src/care-worker/care-worker.entity';
import { OuterCareWorkerEntity } from 'src/outer-care-worker/entity/outer-care-worker.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('outer-care-worker-career')
export class OuterCareWorkerCareerEntity {
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
    type: 'varchar',
    nullable: true,
  })
  public memo: string;

  @Column({
    nullable: false,
  })
  public careWorkerId: string;

  @ManyToOne(
    () => OuterCareWorkerEntity,
    (outerCareWorker) => outerCareWorker.outerCareWorkerCareers,
    {
      nullable: false,
    },
  )
  @JoinColumn({
    name: 'careWorkerId',
    referencedColumnName: 'id',
  })
  public outerCareWorker: OuterCareWorkerEntity;
}
