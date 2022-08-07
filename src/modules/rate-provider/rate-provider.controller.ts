import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { RateProviderService } from './services/rate-provider/rate-provider.service';

@Controller('providers')
export class RateProviderController {

  constructor(private providerService: RateProviderService) {}

  @Get()
  async getProviders() {
    return this.providerService.getProviders();
  }

  @Get(':provider/form-options')
  async getProviderFormOptions(@Param('provider') provider: string) {
    try {
      return await this.providerService.getFormOptions(provider);
    } catch (ex) {
      throw new BadRequestException();
    }
  }

}
