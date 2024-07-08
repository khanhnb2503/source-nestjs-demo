import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';

/**
 * @description
 *  Pipe này sử dụng như 1 custom pipe 
 *  Pipe này sẽ chạy sau class validator 
 *  Tác dụng: Trasnform object ID từ string thành dạng Object ID của MongoDB
*/
@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: string) {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(`Invalid Object ID`)
    }
    return new Types.ObjectId(value);
  }
}

/**
 * @description
 * Tạo mới 1 pipe để kiểm tra objectId từ các query.
 *  Pipe này sử dụng trong DTO kết hợp class validator
 *  Trasnform object ID hoặc IDs từ string hoặc string[] thành dạng Object ID của MongoDB
 */
export const ParseObjectId = function (params?: { key?: string }) {
  return Transform(({ value }) => {
    if (Array.isArray(value)) {
      //validate
      for (const el of value) {
        const validObjectId = Types.ObjectId.isValid(el);
        if (!validObjectId) {
          throw new BadRequestException(`Invalid Object ID at ${params.key}`);
        }
      }
      //transform
      return value.map((el) => {
        return Types.ObjectId.createFromHexString(el);
      });
    } else {
      const validObjectId = Types.ObjectId.isValid(value);
      if (!validObjectId) {
        throw new BadRequestException(` Invalid Object ID at ${params.key} `);
      }
      return Types.ObjectId.createFromHexString(value);
    }
  });
};
