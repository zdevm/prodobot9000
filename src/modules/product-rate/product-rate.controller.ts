import { JwtGuard } from '@modules/auth/decorators/jwt-guard.decorator';
import { AppAbility } from '@modules/casl/classes/casl-ability.factory';
import { UserAbility } from '@modules/casl/decorators/user-ability';
import { CreateUserAbilityInterceptor } from '@modules/casl/interceptors/create-user-ability/create-user-ability.interceptor';
import { ProductService } from '@modules/product/services/product/product.service';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { PermissionsHelperService } from '@services/permissions-helper.service';
import { IsMongoIdPipe } from 'src/pipes/is-mongo-id.pipe';
import { ProductRateService } from './services/product-rate/product-rate.service';

@Controller('rates')
@JwtGuard()
@UseInterceptors(CreateUserAbilityInterceptor)
export class ProductRateController {

  public constructor(private readonly productRateService: ProductRateService,
                     private readonly productService: ProductService) {}

  @Get(':productId/latest')
  async getLatestOfEachProvider(@Param('productId', IsMongoIdPipe) productId: string,
                                @UserAbility() ability?: AppAbility) {
    await PermissionsHelperService.canReadOrThrowAsync(this.productService.findById(productId), ability)
    return this.productRateService.getLatestOfEachProvider(productId);
  }

}
