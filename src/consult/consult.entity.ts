import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('consult')
export class ConsultEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  public contact: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  public isFinished: boolean;
}
