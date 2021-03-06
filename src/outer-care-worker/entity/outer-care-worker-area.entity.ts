import { CareWorkerEntity } from 'src/care-worker/care-worker.entity';
import { OuterCareWorkerEntity } from 'src/outer-care-worker/entity/outer-care-worker.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('outer-care-worker-area')
export class OuterCareWorkerAreaEntity {
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

  @ManyToOne(
    () => OuterCareWorkerEntity,
    (outerCareWorker) => outerCareWorker.outerCareWorkerAreas,
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
