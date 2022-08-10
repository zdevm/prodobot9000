import { Expose, Type } from "class-transformer";

export class User {

  @Expose()
  @Type(() => String)
  id: string;

  @Expose()
  firstName: string;
  
  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  verifiedAt: Date;

  @Expose()
  createdAt: Date

  @Expose()
  updatedAt: Date;

}
