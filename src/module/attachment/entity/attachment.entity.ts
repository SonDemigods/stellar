import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@common/entity/base.entity';

@Entity('star_attachment')
export class Attachment extends BaseEntity {
  @Column({
    type: 'varchar',
    name: 'original_filename',
    length: 255,
    nullable: false,
  })
  originalFilename: string;

  @Column({ type: 'int', name: 'file_size' })
  fileSize: number;

  @Column({ type: 'varchar', name: 'file_type', length: 100 })
  fileType: string;

  @Column({
    type: 'varchar',
    name: 'storage_path',
    length: 500,
    nullable: false,
  })
  storagePath: string;

  @Column({
    type: 'varchar',
    name: 'bucket_name',
    length: 100,
    nullable: false,
  })
  bucketName: string;

  @Column({ type: 'varchar', name: 'md5', length: 32, nullable: true })
  md5: string;

  @Column({
    type: 'int',
    name: 'access_permission',
    nullable: false,
    default: 0,
  })
  accessPermission: number;
}
