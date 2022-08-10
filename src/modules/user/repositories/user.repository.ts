import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { plainToInstance } from "class-transformer";
import { Model } from "mongoose";
import { User } from "../classes/user";
import { RegisterUserDto } from "../dto/register-user.dto";
import { MongooseUser, UserDocument } from "../schemas/user.schema";

@Injectable()
export class UserRepository {

  @InjectModel(MongooseUser.name)
  model: Model<UserDocument>;

  public constructor() {}

  create(user: RegisterUserDto) {
    return this.model.create(user).then(UserRepository.transform);
  }

  static transform(doc: UserDocument): User | User[] {
    return plainToInstance(User, doc, { excludeExtraneousValues: true })
  }

}