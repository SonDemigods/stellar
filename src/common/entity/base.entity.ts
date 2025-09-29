import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export abstract class BaseEntity {
  @PrimaryColumn({ type: 'uuid', name: 'id' })
  id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'create_time' })
  createTime: Date;

  @Column({
    type: 'varchar',
    name: 'create_user_id',
    length: 36,
    default: '0',
  })
  createUserId: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'update_time' })
  updateTime: Date;

  @Column({
    type: 'varchar',
    length: 36,
    name: 'update_user_id',
    default: '0',
  })
  updateUserId: string;

  @Column({ type: 'int', name: 'delete_flag', default: 0 })
  deleteFlag: number;
}
