import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

import { ResponseDto } from '@/common/dto/base.dto';
import {
  RegisterUserDto,
  LoginRequestDto,
  UpdateUserDto,
  QueryUserDto,
  UserDataDto,
  UserPageDataDto,
  LoginResponseDto,
} from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('用户管理')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '获取用户列表', description: '分页查询用户信息' })
  @ApiResponse({ status: 200, type: UserPageDataDto })
  @Get()
  async findList(
    @Query() queryUserDto: QueryUserDto,
  ): Promise<UserPageDataDto | ResponseDto> {
    return this.userService.findList(queryUserDto);
  }

  @ApiOperation({
    summary: '获取用户详情',
    description: '根据ID获取用户详细信息',
  })
  @ApiResponse({ status: 200, type: UserDataDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDataDto | ResponseDto> {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: '更新用户信息', description: '修改用户信息' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, type: UserDataDto })
  @Put()
  @HttpCode(200)
  async update(
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDataDto | ResponseDto> {
    return this.userService.update(updateUserDto);
  }

  @ApiOperation({ summary: '用户注册', description: '创建新用户账号' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ status: 200, type: UserDataDto })
  @Post('register')
  @HttpCode(200)
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<UserDataDto | ResponseDto> {
    return this.userService.register(registerUserDto);
  }

  @ApiOperation({ summary: '删除用户', description: '软删除用户账号' })
  @ApiResponse({ status: 200, type: UserDataDto })
  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string): Promise<UserDataDto | ResponseDto> {
    return this.userService.remove(id);
  }

  @ApiOperation({ summary: '用户登录', description: '用户登录获取访问令牌' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() LoginRequestDto: LoginRequestDto,
  ): Promise<LoginResponseDto | ResponseDto> {
    return this.userService.login(LoginRequestDto);
  }
}
