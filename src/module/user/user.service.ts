import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

import { User } from './entity/user.entity';
import {
  RegisterUserDto,
  LoginUserDto,
  UpdateUserDto,
  UpdatePasswordDto,
  QueryUserDto,
  UserResponseDto,
  UserListResponseDto,
  LoginResponseDto,
} from './dto/user.dto';
import { UserServiceInterface } from './interface/user.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  /**
   * 用户注册
   */
  async register(registerUserDto: RegisterUserDto): Promise<UserResponseDto> {
    // 检查用户名是否已存在
    const existingUser = await this.userRepository.findOneBy({
      userName: registerUserDto.userName,
      deleteFlag: 0,
    });

    if (existingUser) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: '用户名已存在',
        },
        HttpStatus.CONFLICT,
      );
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

    // 创建用户
    const user = new User();
    user.id = uuidv4();
    user.userName = registerUserDto.userName;
    user.password = hashedPassword;
    user.name = registerUserDto.name;
    user.photo = registerUserDto.photo || '';
    user.nickname = registerUserDto.nickname || '';
    user.phone = registerUserDto.phone || '';
    user.idCard = registerUserDto.idCard || '';
    user.gender = registerUserDto.gender || 0;
    user.createUserId = 'system';
    user.updateUserId = 'system';

    const savedUser = await this.userRepository.save(user);

    // 不返回密码信息，创建一个不包含密码的新对象
    const userWithoutPassword = { ...savedUser };

    return {
      statusCode: HttpStatus.OK,
      message: '注册成功',
      data: userWithoutPassword,
    };
  }

  /**
   * 用户登录
   */
  async login(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    // 查找用户
    const user = await this.userRepository.findOneBy({
      userName: loginUserDto.userName,
      deleteFlag: 0,
    });

    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: '用户名或密码错误',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // 验证密码
    const isValidPassword = await this.verifyPassword(
      loginUserDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: '用户名或密码错误',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // 不返回密码信息
    const userWithoutPassword = { ...user };

    return {
      statusCode: HttpStatus.OK,
      message: '登录成功',
      user: userWithoutPassword,
    };
  }

  /**
   * 根据ID查询用户
   */
  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneBy({
      id,
      deleteFlag: 0,
    });

    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: '用户不存在',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // 不返回密码信息，创建一个不包含密码的新对象
    const userWithoutPassword = { ...user };

    return {
      statusCode: HttpStatus.OK,
      message: '查询成功',
      data: userWithoutPassword,
    };
  }

  /**
   * 查询用户列表
   */
  async findList(queryUserDto: QueryUserDto): Promise<UserListResponseDto> {
    const { keyword, page = 1, pageSize = 10 } = queryUserDto;

    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.delete_flag = :deleteFlag', { deleteFlag: 0 });

    if (keyword) {
      query.andWhere(
        'user.user_name LIKE :keyword OR user.name LIKE :keyword OR user.phone LIKE :keyword',
        { keyword: `%${keyword}%` },
      );
    }

    const [users, total] = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    // 移除密码信息，直接使用类型转换确保类型匹配
    const usersWithoutPassword = users.map((user) => {
      const userCopy = { ...user };
      return userCopy as User;
    });

    return {
      statusCode: HttpStatus.OK,
      message: '查询成功',
      list: usersWithoutPassword,
      total,
    };
  }

  /**
   * 更新用户信息
   */
  async update(updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    // 查找用户
    const user = await this.userRepository.findOneBy({
      id: updateUserDto.id,
      deleteFlag: 0,
    });

    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: '用户不存在',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // 更新用户信息
    if (updateUserDto.photo !== undefined) user.photo = updateUserDto.photo;
    if (updateUserDto.nickname !== undefined)
      user.nickname = updateUserDto.nickname;
    if (updateUserDto.phone !== undefined) user.phone = updateUserDto.phone;
    if (updateUserDto.idCard !== undefined) user.idCard = updateUserDto.idCard;
    if (updateUserDto.name !== undefined) user.name = updateUserDto.name;
    if (updateUserDto.gender !== undefined) user.gender = updateUserDto.gender;

    user.updateUserId = 'current_user'; // 实际应用中应该从token中获取当前用户ID

    const updatedUser = await this.userRepository.save(user);

    // 不返回密码信息，创建一个不包含密码的新对象
    const userWithoutPassword = { ...updatedUser };

    return {
      statusCode: HttpStatus.OK,
      message: '更新成功',
      data: userWithoutPassword,
    };
  }

  /*
   * 修改用户密码
   */
  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponseDto> {
    // 查找用户
    const user = await this.userRepository.findOneBy({
      id: updatePasswordDto.id,
      deleteFlag: 0,
    });

    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: '用户不存在',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // 验证旧密码
    const isValidPassword = await this.verifyPassword(
      updatePasswordDto.oldPassword,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: '旧密码错误',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // 更新密码
    user.password = await bcrypt.hash(updatePasswordDto.newPassword, 10);

    return {
      statusCode: HttpStatus.OK,
      message: '修改密码成功',
    };
  }

  /**
   * 删除用户（软删除）
   */
  async remove(id: string): Promise<UserResponseDto> {
    // 查找用户
    const user = await this.userRepository.findOneBy({
      id,
      deleteFlag: 0,
    });

    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: '用户不存在',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // 软删除
    user.deleteFlag = 1;
    // TODO 从token中获取当前用户ID
    user.updateUserId = 'current_user'; // 实际应用中应该从token中获取当前用户ID

    await this.userRepository.save(user);

    return {
      statusCode: HttpStatus.OK,
      message: '删除成功',
    };
  }

  // 获取当前用户信息
  async getCurrentUser(): Promise<UserResponseDto> {
    // 从token中获取当前用户ID
    const userId = 'current_user'; // 实际应用中应该从token中获取当前用户ID

    // 查找用户
    const user = await this.userRepository.findOneBy({
      id: userId,
      deleteFlag: 0,
    });

    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: '用户不存在',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // 移除密码信息
    const userWithoutPassword = { ...user };

    return {
      statusCode: HttpStatus.OK,
      message: '查询成功',
      data: userWithoutPassword,
    };
  }

  /**
   * 验证用户密码
   */
  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
