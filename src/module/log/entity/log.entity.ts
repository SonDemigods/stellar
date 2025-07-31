import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'star_log' })
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  level: string;

  @Column('text')
  message: string;

  @Column('json')
  meta: any;

  @CreateDateColumn({
    type: 'datetime',
  })
  timestamp: Date;
}
