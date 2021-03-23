import { Column } from 'typeorm';

export class BaseEntity {
  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public updatedAt: string;

  @Column({
    type: 'boolean',
    nullable: true,
    default: false,
  })
  public isDeleted: boolean;
}
