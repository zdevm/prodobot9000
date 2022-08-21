import { Global, Module, Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DemoConfig } from "./interfaces/demo-config.interface";

export const DemoConfigInjectionToken = 'DemoConfigInjectionToken';

const provideDemoConfig: Provider = {
  provide: DemoConfigInjectionToken,
  useFactory: (configService: ConfigService): DemoConfig => configService.get('demo'),
  inject: [ConfigService]
}

@Global()
@Module({
  providers: [provideDemoConfig],
  exports: [provideDemoConfig]
})
export class DemoModule { }