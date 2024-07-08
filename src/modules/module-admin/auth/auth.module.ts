import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { AccessTokenStrategy } from './strategies/access-token.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'N3AHHzKhlYv1wbJRklbcMYpAMMK05CNz3MwKuao67VdYAQn2Oht14WPnvR9DwGKu',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, AccessTokenStrategy],
})
export class AuthModule { }
