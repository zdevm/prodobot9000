import { Expose, Type } from "class-transformer";


export class Product {

  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public description: string;

  @Expose()
  public providers: string[]; // configured providers' slugs

  @Expose()
  public providersForms: {
    [key: string]: { // provider's slug
      getProduct: any;
    }
  }

  @Expose()
  @Type(() => String)
  image?: string;

}