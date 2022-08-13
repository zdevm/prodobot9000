import { User } from "@modules/user/classes/user";
import { Expose, Type } from "class-transformer";
import { StringIdOrInstanceTransform } from "src/decorators/id-or-object.decorator";


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
  @StringIdOrInstanceTransform(User)
  public user: string | User;

  @Expose()
  @Type(() => String)
  image?: string;

}