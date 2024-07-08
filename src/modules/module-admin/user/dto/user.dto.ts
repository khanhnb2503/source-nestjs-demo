import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { IUser } from "~/src/interfaces";

export class CreateUserDto implements IUser {
  @ApiProperty({
    description: 'Nhập tên người dùng',
    required: true
  })
  @IsNotEmpty()
  username: string

  @ApiProperty({
    description: 'Nhập mật khẩu',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  password: string
}
