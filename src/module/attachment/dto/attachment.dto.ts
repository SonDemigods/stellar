import {
  IsOptional,
  IsString,
  IsIn,
  IsUUID,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { QueryPageDto } from '@/common/dto/page.dto';

import { Attachment } from '../entity/attachment.entity';

export class AttachmentResponseDto {
  @ApiProperty({
    description: '文件ID',
    type: String,
    example: '12345678-1234-1234-1234-1234567890ab',
  })
  @IsNotEmpty({ message: '文件ID不能为空' })
  @IsString({ message: '文件ID必须是字符串' })
  @IsUUID('4', { message: '文件ID格式不正确' })
  id: string;

  @ApiProperty({
    description: '原始文件名',
    type: String,
    example: 'example.jpg',
  })
  @IsNotEmpty({ message: '原始文件名不能为空' })
  @IsString({ message: '原始文件名必须是字符串' })
  originalFilename: string;

  @ApiProperty({ description: '文件大小（字节）', type: Number, example: 1024 })
  @IsNotEmpty({ message: '文件大小不能为空' })
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { message: '文件大小必须是数字' },
  )
  fileSize: number;

  @ApiProperty({ description: '文件类型', type: String, example: 'image/jpeg' })
  @IsNotEmpty({ message: '文件类型不能为空' })
  @IsString({ message: '文件类型必须是字符串' })
  fileType: string;

  @ApiProperty({ description: '访问权限', type: Number, example: 0 })
  @IsNotEmpty({ message: '访问权限不能为空' })
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { message: '访问权限必须是数字' },
  )
  accessPermission: number;

  @ApiProperty({
    description: '下载链接',
    type: String,
    example: '/api/attachment/12345678-1234-1234-1234-1234567890ab',
  })
  @IsNotEmpty({ message: '下载链接不能为空' })
  @IsString({ message: '下载链接必须是字符串' })
  downloadUrl: string;

  constructor(attachment: Attachment) {
    this.id = attachment.id;
    this.originalFilename = attachment.originalFilename;
    this.fileSize = attachment.fileSize;
    this.downloadUrl = `/api/attachment/${attachment.id}`;
  }
}

export class UploadFileDto {
  @ApiProperty({
    description: '文件访问权限, 0: 公共, 1: 私有',
    enum: [0, 1],
    default: 0,
  })
  @IsOptional()
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { message: '访问权限必须是数字' },
  )
  @IsIn([0, 1])
  accessPermission?: number = 0;
}

export class QueryUserAttachmentsDto extends QueryPageDto {
  @ApiProperty({ description: '用户ID', example: '1' })
  @IsNotEmpty({ message: '用户ID不能为空' })
  @IsString({ message: '用户ID必须是字符串' })
  @IsUUID('4', { message: '用户ID格式不正确' })
  userId: string;
}
