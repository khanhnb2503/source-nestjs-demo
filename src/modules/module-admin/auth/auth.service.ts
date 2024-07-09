import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { LoginAuthDto } from './dto/login-auth.dto';
import { UserRepository } from '../../module-repository/repository';
import { EnumResponseError } from './auth.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async login(body: LoginAuthDto) {
    const user = await this.userRepository.findOneByParams({ conditions: { username: body.username } });

    if (!user) throw new BadRequestException(EnumResponseError.USERNAME_NOT_EXIST)
    await this.comparePassword(body.password, user.password);

    const token = await this.generateTokens(user);

    return { data: { ...token, user } }
  }

  async refreshToken(body: any) {
    // const decode: any = this.jwtService.decode(body.refreshToken);
    // if (decode.type !== EnumTokenType.REFRESH_TOKEN) throw new BadRequestException('NOT REFRESH TOKEN');
    // const user = await this.userRepository.findById({ id: decode.userId, populate: [{ path: 'role' }] });

    // if (!user) throw new BadRequestException(EnumResponseError.NOT_EXIST_THIS_EMAIL);
    // if (!user.status.isActive) throw new BadRequestException(EnumResponseError.ACCOUNT_IS_INACTIVE);

    // const accessToken = this.signToken({ user, typeToken: EnumTokenType.ACCESS_TOKEN });
    // return { accessToken }
    return 'accessToken';
  }

  // Generate tokens
  private async generateTokens(user: any) {
    const payload = {
      username: user.username,
      email: user.email,
      sub: user._id
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.accessSecret'),
        expiresIn: this.configService.get<string>('jwt.accessExpiresIn')
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn')
      }),
    ]);

    return { accessToken, refreshToken }
  }

  private async comparePassword(passInput: string, passDb: string) {
    const isTrue = await bcryptjs.compare(passInput, passDb);
    if (!isTrue) {
      throw new BadRequestException(EnumResponseError.INVALID_PASSWORD);
    }
    return isTrue;
  }

  private async passwordEnCryption(password: string) {
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = bcryptjs.hashSync(password, salt);
    return hashPassword;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    return {}
  }
}
