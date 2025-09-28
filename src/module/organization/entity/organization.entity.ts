import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@/common/entity/base.entity';

@Entity({ name: 'star_organization' })
export class Organization extends BaseEntity {
  @Column({ type: 'varchar', name: 'organization_code', length: 100 })
  organizationCode: string;

  @Column({ type: 'varchar', name: 'name', length: 100 })
  name: string;

  @Column({ type: 'varchar', name: 'parent_id', length: 36 })
  parentId: string;
}
