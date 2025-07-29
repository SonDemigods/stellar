import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'log' })
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  level: string;

  @Column('text')
  message: string;

  @Column('json', { nullable: true })
  meta: any;

  @CreateDateColumn({
    type: 'timestamp',
  })
  timestamp: Date;
}
