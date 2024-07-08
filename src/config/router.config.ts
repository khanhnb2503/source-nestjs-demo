import { INestApplication, RequestMethod } from "@nestjs/common";

export const routerConfig = (app: INestApplication) => {
  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: '', method: RequestMethod.GET }] // Thiết lập tiền tố cho tất cả api, trừ đường dẫn / khi sử dụng phương thức GET;
  })
}