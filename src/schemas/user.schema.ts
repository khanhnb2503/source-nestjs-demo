import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { HydratedDocument, Document } from 'mongoose';

import { SCHEMA_OPTIONS } from '../config';
import { IUser } from 'src/interfaces';
import { getCurrentTime } from '../utils';

@Schema({ ...SCHEMA_OPTIONS })
export class Users extends Document implements IUser {
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  username: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  password: string;

  @Prop({ type: Date, default: getCurrentTime() })
  createdAt: Date;

  @Prop({ type: Date, default: getCurrentTime() })
  updatedAt: Date;
}

export type UsersDocument = HydratedDocument<Users>;

export const UsersSchema = SchemaFactory.createForClass(Users);