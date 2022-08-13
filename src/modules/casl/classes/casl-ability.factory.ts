import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from "@casl/ability";
import { Product } from "@modules/product/classes/product";
import { User } from "@modules/user/classes/user";
import { Injectable } from "@nestjs/common";
import { Action } from "../enums/action.enum";

type Subjects = InferSubjects<typeof User | typeof Product> | 'all';

export type AppAbility = Ability<[string, Subjects]>;

const allCrudActions = [Action.Create, Action.Read, Action.Update, Action.Delete];

@Injectable()
export class CaslAbilityFactory {
  createForUser(userId: string) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[string, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    // User
    can(allCrudActions, User, { id: userId });
    // Product
    can(allCrudActions, Product, { user: userId });
    can(allCrudActions, Product, { 'user.id': userId } as any);

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}