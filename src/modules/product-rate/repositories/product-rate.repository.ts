import { ProductDocument } from "@modules/product/schemas/product.schema";
import { InjectModel } from "@nestjs/mongoose";
import { plainToInstance } from "class-transformer";
import { Model, mongo } from "mongoose";
import { ProductRate } from "../classes/product-rate";
import { MongooseProductRate, ProductRateDocument } from "../schemas/product-rate.schema";
import { pick } from 'lodash';

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
          }, 
          'product': {
            '$first': '$product'
          }
        }
      }, {
        '$lookup': {
          'from': 'products', 
          'localField': 'product', 
          'foreignField': '_id', 
          'as': 'product'
        }
      }, {
        '$project': {
          '_id': 1, 
          'rate': 1, 
          'product': {
            '$arrayElemAt': [
              '$product', 0
            ]
          }
        }
      } // _id = providerSlug
    ]).then((docs: {_id: string; rate: ProductRateDocument, product: Partial<ProductDocument>}[]) =>
      docs.filter(d => (d.product?.providers || []).includes(d._id))
          .map(rate => ProductRateRepository.transform(rate.rate))
    )
  }

  /**
   * Return product's price history from the first ever scan to the latest (day by day).
   */
  async getPriceHistoryOfProduct(productId: string): Promise<{ date: Date; rates: Pick<ProductRate, 'providerSlug' | 'price'>[]; }[]> {
    const results: {
      date: Date;
      rates: Pick<ProductRate, 'providerSlug' | 'price'>[];
    }[] = [];
    const ratesGroupedByDay = await this.model.aggregate([
      {
        '$match': {
          'product': new mongo.ObjectId(productId)
        }
      }, {
        '$group': {
          '_id': {
            '$dateToString': {
              'format': '%Y-%m-%d', 
              'date': '$createdAt'
            }
          }, 
          'rates': {
            '$push': '$$ROOT'
          }
        }
      }
    ]);
    for (const groupDate of ratesGroupedByDay) {
      const date = groupDate._id;
      const result = {
        date: new Date(date),
        rates: []
      };
      // keep only the cheapest rate of each provider for the current day
      const providerCheapestPriceMap: Record<string, Pick<ProductRate, 'providerSlug' | 'price'>> = {};
      const innerArray = groupDate.rates || [];
      for (const rate of innerArray) {
        const providerSlug = rate.providerSlug;
        const currentProviderCheapest = providerCheapestPriceMap[providerSlug];
        if (!currentProviderCheapest || currentProviderCheapest.price > rate.price) {
          providerCheapestPriceMap[providerSlug] = rate;
        }
      }
      result.rates = Object.values(providerCheapestPriceMap).map(rate => pick(rate, 'price', 'providerSlug'));
      results.push(result);
    }

    return results;
  }


  static transform(docs: ProductRateDocument[]): ProductRate[]
  static transform(doc: ProductRateDocument): ProductRate
  static transform(docs: ProductRateDocument | ProductRateDocument[]): ProductRate | ProductRate[] {
    return plainToInstance(ProductRate, docs, { excludeExtraneousValues: true });
  }

}