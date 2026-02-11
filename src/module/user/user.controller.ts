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
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

import {
  RegisterUserDto,
  LoginUserDto,
  UpdateUserDto,
  QueryUserDto,
  UserResponseDto,
  UserListResponseDto,
  LoginResponseDto,
} from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('用户管理')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '用户注册', description: '创建新用户账号' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @Post('register')
  @HttpCode(200)
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.register(registerUserDto);
  }

  @ApiOperation({ summary: '用户登录', description: '用户登录获取访问令牌' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    return this.userService.login(loginUserDto);
  }

  @ApiOperation({ summary: '获取用户列表', description: '分页查询用户信息' })
  @ApiQuery({ name: 'keyword', required: false, description: '搜索关键词' })
  @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, description: '每页数量' })
  @ApiResponse({ status: 200, type: UserListResponseDto })
  @Get()
  async findList(
    @Query() queryUserDto: QueryUserDto,
  ): Promise<UserListResponseDto> {
    return this.userService.findList(queryUserDto);
  }

  @ApiOperation({
    summary: '获取用户详情',
    description: '根据ID获取用户详细信息',
  })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: '更新用户信息', description: '修改用户信息' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @Put()
  @HttpCode(200)
  async update(@Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return this.userService.update(updateUserDto);
  }

  @ApiOperation({ summary: '删除用户', description: '软删除用户账号' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.remove(id);
  }
}
