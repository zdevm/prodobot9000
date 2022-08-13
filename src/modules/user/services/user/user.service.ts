import { RegisterUserDto } from '@modules/user/dto/register-user.dto';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {

  public constructor(private readonly userRepository: UserRepository) {}

  register(user: RegisterUserDto) {
    return this.userRepository.create(user);
  }

  findById(id: string) {
    return this.userRepository.findById(id);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneByEmail(email);
  }

}