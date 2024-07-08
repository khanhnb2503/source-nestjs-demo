import { ApiOperationOptions } from "@nestjs/swagger";

const apiOperationCreateUser: ApiOperationOptions = {
  summary: 'Admin create new user',
  description: `
    * Only admin can use this API
    * Admin create user and give some specific information
  `
}

const apiOperationListUser: ApiOperationOptions = {
  summary: 'Admin list user',
  description: `
    * Only admin can use this API
    * Admin create user and give some specific information
  `
}

const apiOperationDetailUser: ApiOperationOptions = {
  summary: 'Admin detail user',
  description: `
    * Only admin can use this API
    * Admin create user and give some specific information
  `
}

const apiOperationUpdateUser: ApiOperationOptions = {
  summary: 'Admin update user',
  description: `
    * Only admin can use this API
    * Admin create user and give some specific information
  `
}

const apiOperationDeleteUser: ApiOperationOptions = {
  summary: 'Admin delete user',
  description: `
    * Only admin can use this API
    * Admin create user and give some specific information
  `
}

export const API_OPERATION_ACTION = {
  CREATE: apiOperationCreateUser,
  LIST: apiOperationListUser,
  DETAIL: apiOperationDetailUser,
  UPDATE: apiOperationUpdateUser,
  DELETE: apiOperationDeleteUser
}