import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString } from "class-validator";

export class BaseQuery {
  @ApiProperty({
    description: 'Vị trí bản ghi bắt đầu lấy',
  })
  @IsNumberString() // TODO: Kiểm tra xem 1 chuỗi có phải là số hay không
  @IsNotEmpty()
  page: number

  @ApiProperty({
    description: 'Tổng số bản ghi',
    required: true
  })
  @IsNumberString()
  @IsNotEmpty()
  pageSize: number
}
