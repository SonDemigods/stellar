import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class ResponseDto {
  @IsNotEmpty()
  @IsInt()
  statusCode: number;

  @IsNotEmpty()
  @IsString()
  message: string;

  data?: any;
}
