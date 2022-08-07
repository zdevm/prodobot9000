import { ProductRate } from '@modules/product-rate/classes/product-rate';
import { ProductRateRepository } from '@modules/product-rate/repositories/product-rate.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductRateService {

  public constructor(private readonly repository: ProductRateRepository) {}

  insertMany(rates: Pick<ProductRate, 'price' | 'product' | 'providerSlug'>[]) {
    return this.repository.insertMany(rates);
  }

  /**
   * Returns last scanned rate of each provider of the specified product.
   * @param productId Product's rates we want to retrieve
   */
  getLatestOfEachProvider(productId: string): Promise<ProductRate[]> {
    return this.repository.getLatestOfEachProvider(productId);
  }

}
