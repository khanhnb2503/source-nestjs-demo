import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as bodyParser from 'body-parser';
import { json, urlencoded } from 'express';
import * as compression from 'compression';

export const nestConfig = (app: INestApplication) => {
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    maxAge: 86400 // Cho phép trình duyệt lưu trữ kết quả trong 1 ngày
  });
  app.use(bodyParser.json());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );
  app.use(json({limit: '50mb'})); // Thiết lập middleware để xử lí các yêu cầu của payload JSON với giới hạn kích thước là 50mb
  app.use(compression()); // Nén các phản hồi HTTP, kích thước từ server-> client sẽ được giảm, web chạy nhanh hơn.
  app.use(urlencoded({ extended: true, limit: '50mb' })); // Thiết lập middleware để xử lý các yêu cầu URL-encoded với giới hạn kích thước là 50MB. Tùy chọn extended: true cho phép phân tích các đối tượng phức tạp và nested.

}