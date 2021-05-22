import { OuterCareWorkerEntity } from 'src/outer-care-worker/entity/outer-care-worker.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('outer-care-worker-meta')
export class OuterCareWorkerMetaEntity {
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
    type: 'varchar',
    nullable: false,
  })
  public careWorkerId: string;

  @ManyToOne(
    () => OuterCareWorkerEntity,
    (outerCareWorker) => outerCareWorker.outerCareWorkerMetas,
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
