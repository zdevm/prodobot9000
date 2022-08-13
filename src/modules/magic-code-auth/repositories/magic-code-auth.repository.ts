import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { plainToInstance } from "class-transformer";
import { Model } from "mongoose";
import { MagicCodeAuth } from "../classes/magic-code-auth";
import { MagicCodeAuthDocument, MongooseMagicCodeAuth } from "../schemas/magic-code.schema";

@Injectable()
export class MagicCodeAuthRepository {

  @InjectModel(MongooseMagicCodeAuth.name)
  model: Model<MagicCodeAuthDocument>;

  create(dto: Pick<MagicCodeAuth, 'code' | 'expiresAt'> & { user: string }) {
    return this.model.create(dto).then(doc => <MagicCodeAuth>MagicCodeAuthRepository.transform(doc))
  }

  findById(id: string, options?: { populateUser: boolean }) {
    const moptions: any = {};
    if (options.populateUser) {
      moptions.populate = 'user';
    }
    return this.model.findById(id, null, moptions).then(doc => <MagicCodeAuth>MagicCodeAuthRepository.transform(doc))
  }

  /**
   * @param id 
   * @param partial 
   * @returns Updated MagicCodeAuth
   */
  updateById(id: string, partial: Partial<MagicCodeAuth>) {
    return this.model.findByIdAndUpdate(id, partial, { new: true }).then(doc => <MagicCodeAuth>MagicCodeAuthRepository.transform(doc))
  }

  static transform(doc: any): MagicCodeAuth | MagicCodeAuth[] {
    return plainToInstance(MagicCodeAuth, doc, { excludeExtraneousValues: true })
  }

}