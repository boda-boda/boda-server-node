import { CareCenterEntity } from 'src/care-center/care-center.entity';
import { BaseEntity } from 'src/common/entity/base';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OuterCareWorkerEntity } from './outer-care-worker.entity';

@Entity('worker-compliment')
export class WorkerComplimentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public content: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public careCenterId: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public outerCareWorkerId: string;

  @ManyToOne(() => CareCenterEntity, (careCenterEntity) => careCenterEntity.careCenterMetas, {
    nullable: true,
  })
  @JoinColumn({
    name: 'careCenterId',
    referencedColumnName: 'id',
  })
  public careCenter: CareCenterEntity;

  @ManyToOne(
    () => OuterCareWorkerEntity,
    (outerCareWorkerEntity) => outerCareWorkerEntity.connectedCenters,
    {
      nullable: true,
    },
  )
  @JoinColumn({
    name: 'outerCareWorkerId',
    referencedColumnName: 'id',
  })
  public outerCareWorker: OuterCareWorkerEntity;
}
