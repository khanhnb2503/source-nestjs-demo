import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RepositoryModuleGlobal } from '../module-repository/repository.module';
import configuration from '~/src/config/configuration';
import { ModulesAdmin } from '../module-admin/index.module';
import { ModulesClient } from '../module-client/index.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    RepositoryModuleGlobal,
    ModulesAdmin,
    ModulesClient
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Thiết lập Authentication ở tất cả các Router
    // {
    //   provide: APP_GUARD,
    //   useClass: AccessTokenGuard
    // }

    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule { }
