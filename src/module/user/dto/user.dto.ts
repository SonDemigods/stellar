import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '@common/dto/response.dto';

// 用户基础DTO
export class UserBaseDto {
  @ApiProperty({ description: '用户名', example: 'user123' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(4, { message: '用户名长度至少为4个字符' })
  @MaxLength(20, { message: '用户名长度最多为20个字符' })
  userName: string;

  @ApiProperty({ description: '姓名', example: '张三' })
  @IsNotEmpty({ message: '姓名不能为空' })
  @MaxLength(20, { message: '姓名长度最多为20个字符' })
  name: string;

  @ApiProperty({
    description: '头像URL',
    example: 'https://example.com/photo.jpg',
  })
  @IsOptional()
  @MaxLength(255, { message: '头像URL长度最多为255个字符' })
  photo?: string;

  @ApiProperty({ description: '昵称', example: '张三' })
  @IsOptional()
  @MaxLength(20, { message: '昵称长度最多为20个字符' })
  nickname?: string;

  @ApiProperty({ description: '手机号', example: '13800138000' })
  @IsOptional()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone?: string;

  @ApiProperty({ description: '身份证号', example: '44030419900101001X' })
  @IsOptional()
  @Matches(/^\d{17}[\dXx]$/, { message: '身份证号格式不正确' })
  idCard?: string;

  @ApiProperty({ description: '性别', example: 1 })
  @IsOptional()
  @IsNumber({}, { message: '性别必须是数字' })
  gender?: number;
}

// 用户注册DTO
export class RegisterUserDto extends UserBaseDto {
  @ApiProperty({ description: '密码', example: 'password123' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度至少为6个字符' })
  @MaxLength(50, { message: '密码长度最多为50个字符' })
  password: string;
}

// 用户登录DTO
export class LoginUserDto {
  @ApiProperty({ description: '用户名', example: 'user123' })
  @IsNotEmpty({ message: '用户名不能为空' })
  userName: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}

// 更新用户DTO
export class UpdateUserDto extends UserBaseDto {
  @ApiProperty({ description: '用户ID', example: '1234567890' })
  @IsNotEmpty({ message: '用户ID不能为空' })
  id: string;
}

// 修改用户密码DTO
export class UpdatePasswordDto {
  @ApiProperty({ description: '用户ID', example: '1234567890' })
  @IsNotEmpty({ message: '用户ID不能为空' })
  id: string;

  @ApiProperty({ description: '旧密码', example: 'oldPassword123' })
  @IsNotEmpty({ message: '旧密码不能为空' })
  oldPassword: string;

  @ApiProperty({ description: '新密码', example: 'newPassword123' })
  @IsNotEmpty({ message: '新密码不能为空' })
  @MinLength(6, { message: '新密码长度至少为6个字符' })
  @MaxLength(50, { message: '新密码长度最多为50个字符' })
  newPassword: string;
}

// 查询用户DTO
export class QueryUserDto {
  @ApiProperty({ description: '查询关键词', example: '张三' })
  @IsOptional()
  @IsString({ message: '关键词必须是字符串' })
  keyword?: string;

  @ApiProperty({ description: '页码', example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码必须大于等于1' })
  page?: number;

  @ApiProperty({ description: '每页数量', example: 10 })
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量必须大于等于1' })
  pageSize?: number;
}

// 用户响应DTO
export class UserResponseDto extends ResponseDto {
  declare data?: UserBaseDto;
}

// 用户列表响应DTO
export class UserListResponseDto extends ResponseDto {
  list?: UserBaseDto[];
  total?: number;
}

// 登录响应DTO
export class LoginResponseDto extends ResponseDto {
  token?: string;
  user?: Partial<UserBaseDto>;
}
