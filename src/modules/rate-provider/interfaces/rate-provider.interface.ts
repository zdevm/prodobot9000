import { ProductRate } from "@modules/product-rate/classes/product-rate";
import { RateProviderFormOptions } from "./form-options.interface";

export interface RateProvider {

  getName(provider: string): Promise<string>;

  getWebsite(provider: string): Promise<string | null>;

  getFormOptions(provider: string): Promise<RateProviderFormOptions>;

  getProduct(provider: string, dto: any): Promise<Pick<ProductRate, 'price' | 'currency'>>;

}