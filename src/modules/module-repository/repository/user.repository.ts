import { Injectable } from "@nestjs/common";
import { Connection } from 'mongoose';
import { InjectConnection } from "@nestjs/mongoose";

import { CommonRepository } from "~/src/common/common.repository";
import { UsersDocument, UsersSchema } from "~/src/schemas";
import { CollectionEnum } from "~/src/core/enum";

@Injectable()
export class UserRepository extends CommonRepository<UsersDocument> {
  constructor(
    @InjectConnection() private connection: Connection
  ) {
    super(connection.model<UsersDocument>(CollectionEnum.USERS, UsersSchema))
  }
}
