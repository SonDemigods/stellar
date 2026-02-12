import {
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { QueryPageDto, PageDataDto } from '@common/dto/page.dto';

// 用户基础DTO
class UserBaseDto {
  @ApiProperty({
    description: '用户名',
    type: String,
    example: 'user123',
  })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  @MinLength(4, { message: '用户名长度至少为4个字符' })
  @MaxLength(20, { message: '用户名长度最多为20个字符' })
  userName: string;

  @ApiProperty({
    description: '姓名',
    type: String,
    example: '张三',
  })
  @IsNotEmpty({ message: '姓名不能为空' })
  @IsString({ message: '姓名必须是字符串' })
  @MinLength(2, { message: '姓名长度至少为2个字符' })
  @MaxLength(20, { message: '姓名长度最多为20个字符' })
  name: string;

  @ApiProperty({
    description: '头像URL',
    type: String,
    example: 'https://example.com/photo.jpg',
  })
  @IsOptional()
  @IsString({ message: '头像URL必须是字符串' })
  @MaxLength(255, { message: '头像URL长度最多为255个字符' })
  photo?: string;

  @ApiProperty({
    description: '昵称',
    type: String,
    example: '张三',
  })
  @IsOptional()
  @IsString({ message: '昵称必须是字符串' })
  @MinLength(2, { message: '昵称长度至少为2个字符' })
  @MaxLength(20, { message: '昵称长度最多为20个字符' })
  nickname?: string;

  @ApiProperty({
    description: '手机号',
    type: String,
    example: '13800138000',
  })
  @IsOptional()
  @IsString({ message: '手机号必须是字符串' })
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone?: string;

  @ApiProperty({
    description: '身份证号',
    type: String,
    example: '44030419900101001X',
  })
  @IsOptional()
  @IsString({ message: '身份证号必须是字符串' })
  @Matches(/^\d{17}[\dXx]$/, { message: '身份证号格式不正确' })
  idCard?: string;

  @ApiProperty({
    description: '性别',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: '性别必须是数字' })
  gender?: number;
}

export class UserDataDto extends UserBaseDto {
  @ApiProperty({
    description: '用户ID',
    type: String,
    example: '1234567890',
  })
  @IsNotEmpty({ message: '用户ID不能为空' })
  @IsString({ message: '用户ID必须是字符串' })
  @IsUUID('4', { message: '用户ID格式不正确' })
  id: string;
}

// 查询用户数据传输对象
export class QueryUserDto extends QueryPageDto {
  @ApiProperty({
    description: '查询关键词',
    type: String,
    example: '张三',
  })
  @IsOptional()
  @IsString({ message: '关键词必须是字符串' })
  keyword?: string;
}

// 注册数据传输对象
export class RegisterUserDto extends UserBaseDto {
  @ApiProperty({
    description: '密码',
    type: String,
    example: 'password123',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度至少为6个字符' })
  @MaxLength(50, { message: '密码长度最多为50个字符' })
  password: string;
}

// 更新用户数据传输对象
export class UpdateUserDto extends UserDataDto {}

// 修改用户密码数据传输对象
export class UpdatePasswordDto extends UserDataDto {
  @ApiProperty({
    description: '旧密码',
    type: String,
    example: 'oldPassword123',
  })
  @IsNotEmpty({ message: '旧密码不能为空' })
  @IsString({ message: '旧密码必须是字符串' })
  @MinLength(6, { message: '旧密码长度至少为6个字符' })
  @MaxLength(50, { message: '旧密码长度最多为50个字符' })
  oldPassword: string;

  @ApiProperty({
    description: '新密码',
    type: String,
    example: 'newPassword123',
  })
  @IsNotEmpty({ message: '新密码不能为空' })
  @IsString({ message: '新密码必须是字符串' })
  @MinLength(6, { message: '新密码长度至少为6个字符' })
  @MaxLength(50, { message: '新密码长度最多为50个字符' })
  newPassword: string;
}

// 分页用户数据传输对象
export class UserPageDataDto extends PageDataDto {
  @ApiProperty({
    description: '用户列表',
    type: [UserDataDto],
    example: [
      {
        id: '1234567890',
        userName: 'user123',
        name: '张三',
        photo: 'https://example.com/photo.jpg',
        nickname: '张三',
        phone: '13800138000',
        idCard: '44030419900101001X',
        gender: 1,
      },
    ],
  })
  declare list?: UserDataDto[];
}

// 登录请求数据传输对象
export class LoginRequestDto {
  @ApiProperty({
    description: '用户名',
    type: String,
    example: 'user123',
  })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  userName: string;

  @ApiProperty({
    description: '密码',
    type: String,
    example: 'password123',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度至少为6个字符' })
  @MaxLength(50, { message: '密码长度最多为50个字符' })
  password: string;
}

// 登录响应数据传输对象
export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT令牌',
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token?: string;

  @ApiProperty({
    description: '登录用户信息',
    type: UserDataDto,
    example: {
      id: '1234567890',
      userName: 'user123',
      name: '张三',
      photo: 'https://example.com/photo.jpg',
      nickname: '张三',
      phone: '13800138000',
      idCard: '44030419900101001X',
      gender: 1,
    },
  })
  user?: UserDataDto;
}
