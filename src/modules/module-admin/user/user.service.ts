import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/user.dto';
import { ErrorResponseEnum } from './user.enum';
import { UserRepository } from '../../module-repository/repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.TSchema.create(createUserDto);
    return user;
  }

  async findAll() {
    const users = await this.userRepository.TSchema.find();
    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findById({ id: id });
    if (!user) throw new BadRequestException(ErrorResponseEnum.USER_NOT_FOUND);
    return user;
  }

  async update(id: string, updateUserDto: CreateUserDto) {
    const user = await this.userRepository.findById({ id: id });
    if (!user) throw new BadRequestException(ErrorResponseEnum.USER_NOT_FOUND);
    
    const response = await this.userRepository.TSchema.findByIdAndUpdate(id, updateUserDto, { new: true });
    return response;
  }

  async remove(id: string) {
    const user = await this.userRepository.findById({ id: id });
    if (!user) throw new BadRequestException(ErrorResponseEnum.USER_NOT_FOUND);

    const response = await this.userRepository.TSchema.findByIdAndDelete(id);
    return response;
  }
}
