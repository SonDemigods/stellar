import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity({ name: 'star_user' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', name: 'user_name', length: 20 })
  userName: string;

  @Column({ type: 'varchar', name: 'password', length: 128 })
  password: string;

  @Column({ type: 'varchar', name: 'photo', length: 255, nullable: true })
  photo: string;

  @Column({ type: 'varchar', name: 'nickname', length: 20, nullable: true })
  nickname: string;

  @Column({ type: 'varchar', name: 'phone', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', name: 'id_card', length: 20, nullable: true })
  idCard: string;

  @Column({ type: 'varchar', name: 'name', length: 20 })
  name: string;

  @Column({ type: 'smallint', name: 'gender', default: 0 })
  gender: number;
}
