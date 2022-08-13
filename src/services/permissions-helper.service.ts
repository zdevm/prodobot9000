import { AppAbility } from "@modules/casl/classes/casl-ability.factory"
import { Action } from "@modules/casl/enums/action.enum"
import { ForbiddenException } from "@nestjs/common"

const waitResolve = (promise: Promise<any>) => {
  return promise.catch(obj => undefined);
}

export class PermissionsHelperService {

  static hasPermissionsOrThrow(ability?: AppAbility, abilityTestFn?: (ability: AppAbility) => boolean) {
    if (!ability || !abilityTestFn?.(ability)) {
      throw new ForbiddenException()
    }
  }

  static canReadOrThrow(subjectObject: any, ability?: AppAbility) {
    PermissionsHelperService.hasPermissionsOrThrow(ability, ability => ability.can(Action.Read, subjectObject)) 
  }

  static canUpdateOrThrow(subjectObject: any, ability?: AppAbility) {
    PermissionsHelperService.hasPermissionsOrThrow(ability, ability => ability.can(Action.Update, subjectObject)) 
  }

  static canDeleteOrThrow(subjectObject: any, ability?: AppAbility) {
    PermissionsHelperService.hasPermissionsOrThrow(ability, ability => ability.can(Action.Delete, subjectObject)) 
  }

// async
  static async canReadOrThrowAsync(subjectObject: Promise<any>, ability?: AppAbility) {
    const resolved = await waitResolve(subjectObject);
    PermissionsHelperService.canReadOrThrow(resolved, ability);
  }

  static async canUpdateOrThrowAsync(subjectObject: Promise<any>, ability?: AppAbility) {
    const resolved = await waitResolve(subjectObject);
    PermissionsHelperService.canUpdateOrThrow(resolved, ability) 
  }

  static async canDeleteOrThrowAsync(subjectObject: Promise<any>, ability?: AppAbility) {
    const resolved = await waitResolve(subjectObject);
    PermissionsHelperService.canDeleteOrThrow(resolved, ability);
  }

}