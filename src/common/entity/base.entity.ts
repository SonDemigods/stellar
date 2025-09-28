import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_time' })
  createTime: Date;

  @Column({
    type: 'varchar',
    name: 'create_user_id',
    length: 36,
    default: '0',
  })
  createUserId: string;

  @UpdateDateColumn({ type: 'datetime', name: 'update_time' })
  updateTime: Date;

  @Column({
    type: 'varchar',
    length: 36,
    name: 'update_user_id',
    default: '0',
  })
  updateUserId: string;

  @Column({ type: 'tinyint', name: 'delete_flag', default: 0 })
  deleteFlag: number;
}
