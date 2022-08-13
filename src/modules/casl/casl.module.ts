import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './classes/casl-ability.factory';

@Module({
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
