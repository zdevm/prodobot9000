import { InjectModel } from "@nestjs/mongoose";
import { HelperService } from "@services/helper.service";
import { plainToInstance } from "class-transformer";
import { isArray } from "class-validator";
import { Model } from "mongoose";
import { ProductRate } from "../classes/product-rate";
import { MongooseProductRate, ProductRateDocument } from "../schemas/product-rate.schema";

export class ProductRateRepository {

  @InjectModel(MongooseProductRate.name)
  private model: Model<ProductRateDocument>;

  insertMany(rates: Pick<ProductRate, 'price' | 'product' | 'providerSlug'>[]) {
    return this.model.insertMany(rates).then(docs => ProductRateRepository.transform(docs));
  }


  static transform(docs: ProductRateDocument[]): ProductRate[]
  static transform(doc: ProductRateDocument): ProductRate
  static transform(docs: ProductRateDocument | ProductRateDocument[]): ProductRate | ProductRate[] {
    const isArr = isArray(docs);
    const docsArr = HelperService.toArray<ProductRateDocument>(docs);
    const transformed: ProductRate[] = plainToInstance(ProductRate, docsArr.map(d => d.toObject()), { excludeExtraneousValues: true });
    return isArr ? transformed : transformed[0]; 
  }

}