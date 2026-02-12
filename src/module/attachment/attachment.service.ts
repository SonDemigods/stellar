import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';
import { Attachment } from './entity/attachment.entity';
import { UploadFileDto } from './dto/attachment.dto';
import { LogService } from '@/module/log/log.service';

@Injectable()
export class AttachmentService {
  private minioClient: Minio.Client;
  private readonly bucketName: string;
  private readonly fileSizeLimit: number;
  private readonly allowedFileTypes: string[];

  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
    private readonly logService: LogService,
  ) {
    this.logger.setContext(AttachmentService.name);
    // 初始化MinIO客户端
    this.bucketName =
      this.configService.get<string>('minio.bucketName') || 'galaxy-bucket';
    this.fileSizeLimit =
      this.configService.get<number>('minio.fileSizeLimit') || 10 * 1024 * 1024;
    this.allowedFileTypes = this.configService.get<string[]>(
      'minio.allowedFileTypes',
    ) || ['*'];

    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('minio.endpoint') || 'localhost',
      port: this.configService.get<number>('minio.port') || 9000,
      useSSL: this.configService.get<boolean>('minio.secure') || false,
      accessKey: this.configService.get<string>('minio.accessKey') || 'admin',
      secretKey:
        this.configService.get<string>('minio.secretKey') || 'minioadmin',
    });

    // 确保存储桶存在
    void this.ensureBucketExists();
  }

  /**
   * 确保存储桶存在，不存在则创建
   */
  private async ensureBucketExists(): Promise<void> {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(
          this.bucketName,
          this.configService.get('minio.region'),
        );
        // 设置存储桶策略为私有
        await this.minioClient.setBucketPolicy(
          this.bucketName,
          JSON.stringify({
            Version: '1.0',
            Statement: [
              {
                Effect: 'Deny',
                Principal: '*',
                Action: 's3:*',
                Resource: `arn:aws:s3:::${this.bucketName}/*`,
              },
            ],
          }),
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException('MinIO存储桶初始化失败', message);
    }
  }

  /**
   * 获取用户的文件列表
   */
  async getUserAttachments(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Attachment[]; total: number }> {
    const [data, total] = await this.attachmentRepository.findAndCount({
      where: { createUserId: userId, deleteFlag: 0 },
      order: { createTime: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  /**
   * 根据UUID获取附件信息
   */
  async getAttachmentById(id: string): Promise<Attachment> {
    const attachment = await this.attachmentRepository.findOne({
      where: { id, deleteFlag: 0 },
    });

    if (!attachment) {
      throw new NotFoundException('文件不存在');
    }

    return attachment;
  }

  // TODO 用户id从token中获取
  /**
   * 文件上传
   */
  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    uploadFileDto: UploadFileDto,
  ): Promise<Attachment> {
    try {
      this.logger.info(
        {
          userId,
          originalFilename: file.originalname,
          fileSize: file.size,
          fileType: file.mimetype,
          accessPermission: uploadFileDto.accessPermission,
        },
        '开始上传文件',
      );

      // 验证文件大小
      if (file.size > this.fileSizeLimit) {
        this.logger.warn(
          {
            userId,
            originalFilename: file.originalname,
            fileSize: file.size,
            limit: this.fileSizeLimit,
          },
          '文件大小超过限制',
        );
        throw new BadRequestException(
          `文件大小超过限制，最大允许${this.fileSizeLimit / (1024 * 1024)}MB`,
        );
      }

      // 验证文件类型
      if (
        !this.allowedFileTypes.includes('*') &&
        !this.allowedFileTypes.includes(file.mimetype)
      ) {
        this.logger.warn(
          {
            userId,
            originalFilename: file.originalname,
            fileType: file.mimetype,
            allowedTypes: this.allowedFileTypes,
          },
          '不支持的文件类型',
        );
        throw new BadRequestException(
          `不支持的文件类型，允许的类型：${this.allowedFileTypes.join(', ')}`,
        );
      }

      // 生成唯一文件名
      const fileId = uuidv4();
      const fileExtension = file.originalname.split('.').pop() || '';
      const storageFilename = `${fileId}.${fileExtension}`;
      const storagePath = `attachments/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${storageFilename}`;

      // 上传文件到MinIO
      await this.minioClient.putObject(
        this.bucketName,
        storagePath,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
          'X-Amz-Meta-Original-Filename': file.originalname,
        },
      );

      // 创建附件记录
      const attachment = new Attachment();
      attachment.id = fileId;
      attachment.originalFilename = file.originalname;
      attachment.fileSize = file.size;
      attachment.fileType = file.mimetype;
      attachment.storagePath = storagePath;
      attachment.bucketName = this.bucketName;
      attachment.accessPermission = uploadFileDto.accessPermission || 0;
      attachment.createUserId = userId;
      attachment.createTime = new Date();
      attachment.updateUserId = userId;
      attachment.updateTime = new Date();
      attachment.deleteFlag = 0;

      const createdAttachment =
        await this.attachmentRepository.save(attachment);

      this.logger.info(
        {
          userId,
          fileId: createdAttachment.id,
          originalFilename: createdAttachment.originalFilename,
          storagePath: createdAttachment.storagePath,
        },
        '文件上传成功',
      );

      // 记录到日志服务
      this.logService
        .create(
          'info',
          '文件上传成功',
          JSON.stringify({
            userId,
            fileId: createdAttachment.id,
            originalFilename: createdAttachment.originalFilename,
            fileSize: createdAttachment.fileSize,
            fileType: createdAttachment.fileType,
          }),
        )
        .catch((err) => this.logger.error('保存上传日志失败', err));

      return createdAttachment;
    } catch (error) {
      const code =
        error instanceof Error && 'code' in error
          ? ((error as { code?: string }).code ?? 'UnknownError')
          : 'UnknownError';
      const message = error instanceof Error ? error.message : String(error);
      if (code === 'BadRequestException') {
        throw error;
      }
      this.logger.error(
        {
          userId,
          originalFilename: file.originalname,
          error: message,
        },
        '文件上传失败',
      );
      throw new InternalServerErrorException('文件上传失败', message);
    }
  }

  /**
   * 删除文件
   */
  async deleteFile(id: string, userId: string): Promise<void> {
    const attachment = await this.getAttachmentById(id);

    try {
      // 从MinIO删除文件
      await this.minioClient.removeObject(
        attachment.bucketName,
        attachment.storagePath,
      );

      // 软删除附件记录
      attachment.deleteFlag = 1;
      attachment.updateUserId = userId;
      await this.attachmentRepository.save(attachment);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException('文件删除失败', message);
    }
  }

  /**
   * 文件下载
   */
  async downloadFile(
    id: string,
  ): Promise<{ attachment: Attachment; stream: Minio.BucketStream<Buffer> }> {
    const attachment = await this.getAttachmentById(id);

    try {
      this.logger.info(
        {
          fileId: id,
          originalFilename: attachment.originalFilename,
          userId: attachment.createUserId,
        },
        '开始下载文件',
      );

      // 检查文件是否存在于MinIO
      await this.minioClient.statObject(
        attachment.bucketName,
        attachment.storagePath,
      );

      // 获取文件流
      const stream = await this.minioClient.getObject(
        attachment.bucketName,
        attachment.storagePath,
      );

      this.logger.info(
        {
          fileId: id,
          originalFilename: attachment.originalFilename,
          userId: attachment.createUserId,
        },
        '文件下载成功',
      );

      // 记录到日志服务
      this.logService
        .create(
          'info',
          '文件下载成功',
          JSON.stringify({
            fileId: id,
            originalFilename: attachment.originalFilename,
            userId: attachment.createUserId,
          }),
        )
        .catch((err) => this.logger.error('保存下载日志失败', err));

      return { attachment, stream };
    } catch (error) {
      const code =
        error instanceof Error && 'code' in error
          ? ((error as { code?: string }).code ?? 'UnknownError')
          : 'UnknownError';
      const message = error instanceof Error ? error.message : String(error);
      if (code === 'NoSuchKey') {
        this.logger.warn(
          {
            fileId: id,
            originalFilename: attachment.originalFilename,
          },
          '文件不存在于存储系统',
        );
        throw new NotFoundException('文件不存在于存储系统');
      }

      this.logger.error(
        {
          fileId: id,
          originalFilename: attachment.originalFilename,
          error: message,
        },
        '文件下载失败',
      );
      throw new InternalServerErrorException('文件下载失败', message);
    }
  }

  /**
   * 生成预签名URL（用于断点续传）
   */
  async generatePresignedUrl(
    fileId: string,
    fileName: string,
  ): Promise<string> {
    try {
      const fileExtension = fileName.split('.').pop() || '';
      const storageFilename = `${fileId}.${fileExtension}`;
      const storagePath = `attachments/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${storageFilename}`;

      // 修复：根据MinIO SDK v8的实际实现，presignedPutObject方法只接受3个参数
      const presignedUrl = await this.minioClient.presignedPutObject(
        this.bucketName,
        storagePath,
        3600, // 1小时有效期
      );

      return presignedUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException('生成预签名URL失败', message);
    }
  }
}
