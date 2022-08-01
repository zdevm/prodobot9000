import { Currency } from "@enums/currency.enum";
import { Product } from "@modules/product/classes/product";
import { Expose } from "class-transformer";


export class ProductRate {

  @Expose()
  id: string;

  @Expose()
  product: string | Product;

  @Expose()
  currency: Currency;

  @Expose()
  price: number;

  @Expose()
  providerSlug: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

}