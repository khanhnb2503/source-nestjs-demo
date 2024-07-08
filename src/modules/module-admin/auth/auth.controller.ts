import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { API_OPERATION_ACTION } from './swagger';

@ApiTags('AUTH')
@Controller('/admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation(API_OPERATION_ACTION.LOGIN)
  @Post('/login')
  async login(@Body() body: LoginAuthDto) {
    const response = await this.authService.login(body)
    return response;
  }

  @Post('/refresh-token')
  async refreshToken(@Body() body: any) {
    const response = await this.authService.refreshToken(body);
    return response;
  }

}
