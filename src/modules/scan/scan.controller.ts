import { JwtGuard } from '@modules/auth/decorators/jwt-guard.decorator';
import { AppAbility } from '@modules/casl/classes/casl-ability.factory';
import { UserAbility } from '@modules/casl/decorators/user-ability';
import { CreateUserAbilityInterceptor } from '@modules/casl/interceptors/create-user-ability/create-user-ability.interceptor';
import { ProductService } from '@modules/product/services/product/product.service';
import { Controller, Get, NotFoundException, Param, UseInterceptors } from '@nestjs/common';
import { HelperService } from '@services/helper.service';
import { PermissionsHelperService } from '@services/permissions-helper.service';
import { IsMongoIdPipe } from 'src/pipes/is-mongo-id.pipe';
import { ScanService } from './services/scan/scan.service';

@Controller('scans')
@JwtGuard()
@UseInterceptors(CreateUserAbilityInterceptor)
export class ScanController {
  public constructor(private readonly scanService: ScanService,
                     private readonly productService: ProductService) {}

  @Get(':id')
  async findById(@Param('id', IsMongoIdPipe) id: string,
                 @UserAbility() userAbility?: AppAbility) {
    const scan = await this.scanService.findById(id);
    if (!scan) {
      throw new NotFoundException();
    }
    await PermissionsHelperService.canReadOrThrowAsync(this.productService.findById(HelperService.id(scan.product)), userAbility);
    return scan;
  }

}
