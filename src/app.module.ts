import { Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import paths from './configurations/paths';
import { ExtensionsManagerModule } from './modules/extensions-manager/extensions-manager.module';

const configSettings: ConfigModuleOptions = {
  isGlobal: true,
  load: [paths]
}

@Module({
  imports: [
    ExtensionsManagerModule,
    ConfigModule.forRoot(configSettings)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
