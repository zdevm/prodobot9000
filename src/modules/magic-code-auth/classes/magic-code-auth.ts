import { User } from "@modules/user/classes/user";
import { Expose } from "class-transformer";
import { StringIdOrInstanceTransform } from "src/decorators/id-or-object.decorator";

export class MagicCodeAuth {

  @Expose()
  id: string;
  @Expose()
  code: string;
  @Expose()
  @StringIdOrInstanceTransform(User)
  user: string | User;
  @Expose()
  verifiedAt: Date | null;
  @Expose()
  attempts: number; // if attempts equal maxAttempts and verifiedAt is null, magic code is invalidated
  @Expose()
  maxAttempts: number;
  @Expose()
  expiresAt?: Date;

}