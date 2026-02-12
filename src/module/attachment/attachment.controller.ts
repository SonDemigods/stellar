import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  Body,
  UploadedFile,
  UseInterceptors,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AttachmentService } from './attachment.service';
import { AttachmentResponseDto, UploadFileDto } from './dto/attachment.dto';

@ApiTags('附件')
@Controller('api/attachment')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Get()
  @ApiOperation({ summary: '获取文件列表' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取文件列表成功' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '服务器内部错误',
  })
  async getUserAttachments(
    @Query('userId') userId: string,
    @Query('pageNum') pageNum: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<{ data: AttachmentResponseDto[]; total: number }> {
    const { data, total } = await this.attachmentService.getUserAttachments(
      userId,
      pageNum,
      pageSize,
    );
    return {
      data: data.map((attachment) => new AttachmentResponseDto(attachment)),
      total,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取文件' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取文件成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '文件不存在' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '服务器内部错误',
  })
  async getAttachmentById(
    @Param('id') id: string,
  ): Promise<AttachmentResponseDto> {
    const attachment = await this.attachmentService.getAttachmentById(id);
    return new AttachmentResponseDto(attachment);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除文件' })
  @ApiResponse({ status: HttpStatus.OK, description: '文件删除成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '文件不存在' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '服务器内部错误',
  })
  async deleteFile(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ): Promise<void> {
    // 这里userId应该从JWT token中获取，暂时从查询参数获取
    await this.attachmentService.deleteFile(id, userId || '0');
  }

  @Post('upload')
  @ApiOperation({ summary: '文件上传' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        accessPermission: {
          type: 'number',
          enum: [0, 1],
          default: 0,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '文件上传成功',
    type: AttachmentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '请求参数错误' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '服务器内部错误',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
    @Query('userId') userId: string,
  ): Promise<AttachmentResponseDto> {
    // 这里userId应该从JWT token中获取，暂时从查询参数获取
    const attachment = await this.attachmentService.uploadFile(
      file,
      userId || '0',
      uploadFileDto,
    );
    return new AttachmentResponseDto(attachment);
  }

  @Get(':id')
  @ApiOperation({ summary: '文件下载' })
  @ApiResponse({ status: HttpStatus.OK, description: '文件下载成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '文件不存在' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '服务器内部错误',
  })
  async downloadFile(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    const { attachment, stream } =
      await this.attachmentService.downloadFile(id);

    // 设置响应头
    res.setHeader('Content-Type', attachment.fileType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${encodeURIComponent(attachment.originalFilename)}`,
    );
    res.setHeader('Content-Length', attachment.fileSize);
    res.setHeader('X-File-Id', attachment.id);

    // 管道文件流到响应
    stream.pipe(res);

    // 处理错误
    stream.on('error', (err) => {
      console.error('文件下载流错误:', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('文件下载失败');
    });
  }

  @Get('presigned-url')
  @ApiOperation({ summary: '生成预签名URL（用于断点续传）' })
  @ApiQuery({
    name: 'fileId',
    description: '文件ID',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'fileName',
    description: '文件名',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'fileType',
    description: '文件类型',
    type: String,
    required: true,
  })
  @ApiResponse({ status: HttpStatus.OK, description: '生成预签名URL成功' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '服务器内部错误',
  })
  async generatePresignedUrl(
    @Query('fileId') fileId: string,
    @Query('fileName') fileName: string,
  ): Promise<{ url: string }> {
    const url = await this.attachmentService.generatePresignedUrl(
      fileId,
      fileName,
    );
    return { url };
  }
}
