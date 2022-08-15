import { User } from '@modules/user/classes/user';
import { RegisterUserDto } from '@modules/user/dto/register-user.dto';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {

  public constructor(private readonly userRepository: UserRepository) {}

  register(user: RegisterUserDto) {
    return this.userRepository.create(user);
  }

  updateById(id: string, partial: Partial<User>) {
    return this.userRepository.updateById(id, partial);
  }

  deleteById(id: string) {
    return this.userRepository.deleteById(id);
  }

  findById(id: string) {
    return this.userRepository.findById(id);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneByEmail(email);
  }

}
