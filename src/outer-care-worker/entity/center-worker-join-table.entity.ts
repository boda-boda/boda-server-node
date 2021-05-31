import { CareCenterEntity } from 'src/care-center/care-center.entity';
import { BaseEntity } from 'src/common/entity/base';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { OuterCareWorkerEntity } from './outer-care-worker.entity';

@Entity('center-worker-join-table')
@Unique('UQ_CARECENTER_CAREWORKER', ['careCenterId', 'outerCareWorkerId'])
export class CenterWorkerJoinTableEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public careCenterId: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public outerCareWorkerId: string;

  @ManyToOne(() => CareCenterEntity, (careCenterEntity) => careCenterEntity.connectedOuterWorkers, {
    nullable: false,
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
      nullable: false,
    },
  )
  @JoinColumn({
    name: 'outerCareWorkerId',
    referencedColumnName: 'id',
  })
  public outerCareWorker: OuterCareWorkerEntity;
}
