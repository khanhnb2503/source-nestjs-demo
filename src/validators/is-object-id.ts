import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { Types } from 'mongoose';
import * as _ from 'lodash';
import { BadRequestException } from '@nestjs/common';

/**
 * @description
 * Tạo mới 1 decorator để sử dụng như: DTO, Prop của schema
 * Decorator này chức năng của nó như 1 function của class-validator.
 * Kiểm tra xem objectId hoặc objectId array có phải định dạng của mongoose.
*/

export const IsObjectId = (validationOptions?: ValidationOptions) => {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isObjectId',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(objectId: string[] | string) {
          // TODO: Nếu objectId là 1 array
          if ( _.isArray(objectId)) {
            for (const items of objectId) {
              const validObjectId = Types.ObjectId.isValid(items);
              if (!validObjectId) {
                throw new BadRequestException(`Invalid Object ID at ${items}`);
              }
            }
            return true;
          }

          // TODO: Nếu objectId là 1 string
          if (typeof objectId === 'string') {
            const validObjectId = Types.ObjectId.isValid(objectId);
            if (!validObjectId) {
              throw new BadRequestException(`Invalid Object ID at ${objectId}`);
            }
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} invalid Object ID`;
        },
      },
    });
  };
}