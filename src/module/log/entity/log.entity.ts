import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'star_log' })
export class Log {
  @PrimaryColumn({ type: 'uuid', name: 'id' })
  id: string;

  @Column({ type: 'varchar', name: 'level', length: 10 })
  level: string;

  @Column({ type: 'text', name: 'message' })
  message: string;

  @Column({ type: 'text', name: 'meta' })
  meta: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'create_time',
  })
  createTime: Date;

  @Column({
    type: 'varchar',
    name: 'create_user_id',
    length: 36,
    default: '0',
  })
  createUserId: string;
}
