import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { plainToInstance } from "class-transformer";
import { Model } from "mongoose";
import { Scan } from "../classes/scan";
import { MongooseScan, ScanDocument } from "../schemas/scan.schema";

@Injectable()
export class ScanRepository {

  @InjectModel(MongooseScan.name)
  private model: Model<ScanDocument>;

  create(productId: string, dto: Pick<Scan, 'providersToScan' | 'trigger'>) {
    return this.model.create({
      product: productId,
      ...dto
    }).then(doc => <Scan>ScanRepository.transform(doc))
  }

  findById(id: string) {
    return this.model.findById(id, {}, { populate: 'rates' }).then(doc => <Scan>ScanRepository.transform(doc))
  }

  updateById(id: string, dto: Partial<Scan>) {
    return this.model.findByIdAndUpdate(id, dto, { new: true }).then(doc => <Scan>ScanRepository.transform(doc))
  }

  static transform(doc): Scan | Scan[] {
    return plainToInstance(Scan, doc, { excludeExtraneousValues: true })
  }


}