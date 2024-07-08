import { ApiOperationOptions } from "@nestjs/swagger";

const apiOperationAuthLogin: ApiOperationOptions = {
  summary: 'Đăng nhập',
}

export const API_OPERATION_ACTION = {
  LOGIN: apiOperationAuthLogin,
}