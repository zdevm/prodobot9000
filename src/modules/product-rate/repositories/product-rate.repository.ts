import { InjectModel } from "@nestjs/mongoose";
import { plainToInstance } from "class-transformer";
import { Model, mongo } from "mongoose";
import { ProductRate } from "../classes/product-rate";
import { MongooseProductRate, ProductRateDocument } from "../schemas/product-rate.schema";

export class ProductRateRepository {

  @InjectModel(MongooseProductRate.name)
  private model: Model<ProductRateDocument>;

  insertMany(rates: Pick<ProductRate, 'price' | 'product' | 'providerSlug'>[]) {
    return this.model.insertMany(rates).then(docs => ProductRateRepository.transform(docs));
  }

  /**
   * Returns last scanned rate of each provider of the specified product.
   * @param productId Product's rates we want to retrieve
   */
  getLatestOfEachProvider(productId: string) {
    return this.model.aggregate([
      {
        '$match': {
          'product': new mongo.ObjectId(productId)
        }
      }, {
        '$sort': {
          'createdAt': -1
        }
      }, {
        '$group': {
          '_id': '$providerSlug',
          'rate': {
            '$first': '$$ROOT'
          }
        }
      }
    ]).then((docs: {_id: string; rate: ProductRateDocument}[]) =>
      docs.map(rate => ProductRateRepository.transform(rate.rate))
    )
  }


  static transform(docs: ProductRateDocument[]): ProductRate[]
  static transform(doc: ProductRateDocument): ProductRate
  static transform(docs: ProductRateDocument | ProductRateDocument[]): ProductRate | ProductRate[] {
    return plainToInstance(ProductRate, docs, { excludeExtraneousValues: true });
  }

}