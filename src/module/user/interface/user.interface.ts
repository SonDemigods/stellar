import {
  RegisterUserDto,
  LoginUserDto,
  UpdateUserDto,
  QueryUserDto,
  UserResponseDto,
  UserListResponseDto,
  LoginResponseDto,
} from '../dto/user.dto';

export interface UserServiceInterface {
  /**
   * 用户注册
   * @param registerUserDto 注册信息
   * @returns 注册结果
   */
  register(registerUserDto: RegisterUserDto): Promise<UserResponseDto>;

  /**
   * 用户登录
   * @param loginUserDto 登录信息
   * @returns 登录结果，包含token和用户信息
   */
  login(loginUserDto: LoginUserDto): Promise<LoginResponseDto>;

  /**
   * 根据ID查询用户
   * @param id 用户ID
   * @returns 用户信息
   */
  findOne(id: string): Promise<UserResponseDto>;

  /**
   * 查询用户列表
   * @param queryUserDto 查询条件
   * @returns 用户列表和总数
   */
  findList(queryUserDto: QueryUserDto): Promise<UserListResponseDto>;

  /**
   * 更新用户信息
   * @param updateUserDto 更新信息
   * @returns 更新结果
   */
  update(updateUserDto: UpdateUserDto): Promise<UserResponseDto>;

  /**
   * 删除用户（软删除）
   * @param id 用户ID
   * @returns 删除结果
   */
  remove(id: string): Promise<UserResponseDto>;

  /**
   * 验证用户密码
   * @param password 原始密码
   * @param hashedPassword 加密后的密码
   * @returns 验证结果
   */
  verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
}
