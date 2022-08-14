import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user/user.service';
import { UserRepository } from './repositories/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseUser, UserSchema } from './schemas/user.schema';
import { CaslModule } from '@modules/casl/casl.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongooseUser.name, schema: UserSchema }
    ]),
    CaslModule
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository
  ],
  exports: [UserService]
})
export class UserModule {}
