import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginAuthDto {
  @ApiProperty({
    description: 'Tên đăng nhập',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiProperty({
    description: 'Nhập mật khẩu',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  password: string
}
