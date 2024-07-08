import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app/app.module';
import { nestConfig, routerConfig, swaggerConfig } from './config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  nestConfig(app);
  routerConfig(app);
  swaggerConfig(app);

  const port = configService.get<number>('server.port') || 4000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Application is running on swagger: http://localhost:${port}/api-docs`);
}
bootstrap();
