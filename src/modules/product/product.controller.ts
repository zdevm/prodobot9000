import { PaginateOptions } from '@classes/paginate-options';
import { AuthUserId } from '@modules/auth/decorators/auth-user.decorator';
import { JwtGuard } from '@modules/auth/decorators/jwt-guard.decorator';
import { AppAbility } from '@modules/casl/classes/casl-ability.factory';
import { UserAbility } from '@modules/casl/decorators/user-ability';
import { CreateUserAbilityInterceptor } from '@modules/casl/interceptors/create-user-ability/create-user-ability.interceptor';
import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query,  UseInterceptors, ValidationPipe } from '@nestjs/common';
import { PermissionsHelperService } from '@services/permissions-helper.service';
import { IsMongoIdPipe } from 'src/pipes/is-mongo-id.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ScanTrigger } from '../scan/enums/scan-trigger.enum';
import { ProductService } from './services/product/product.service';

@Controller('products')
@JwtGuard()
@UseInterceptors(CreateUserAbilityInterceptor)
export class ProductController {

  public constructor(private productService: ProductService) {}

  @Get(':id')
  async getProduct(@Param('id', IsMongoIdPipe) productId: string, @UserAbility() userAbility?: AppAbility) {
    const product = await this.productService.findById(productId);
    PermissionsHelperService.canReadOrThrow(product, userAbility);
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }

  @Get()
  async getProducts(@Query('page', ParseIntPipe) page: number,
                    @Query('limit', ParseIntPipe) perPage: number,
                    @AuthUserId() userId: string) {
    const paginateOptions = new PaginateOptions();
    paginateOptions.page = page;
    paginateOptions.limit = perPage;
    return this.productService.getUserProductsPaginated(userId, paginateOptions);
  }

  @Post()
  create(@Body(ValidationPipe) dto: CreateProductDto, @AuthUserId() userId: string) {
    dto.user = userId;
    return this.productService.create(dto)
  }

  @Put(':id')
  async update(@Param('id', IsMongoIdPipe) id: string,
         @Body(ValidationPipe) dto: UpdateProductDto,
         @UserAbility() userAbility?: AppAbility) {
    await PermissionsHelperService.canUpdateOrThrowAsync(this.productService.findById(id), userAbility);
    return this.productService.updateById(id, dto)
  }

  @Delete(':id')
  async delete(@Param('id', IsMongoIdPipe) id: string, @UserAbility() userAbility?: AppAbility) {
    await PermissionsHelperService.canDeleteOrThrowAsync(this.productService.findById(id), userAbility);
    const deleted = await this.productService.deleteById(id);
    if (!deleted) {
      throw new NotFoundException();
    }
    return deleted;
  }

  @Get(':id/scan-prices')
  async scanPrices(@Param('id', IsMongoIdPipe) productId: string,
                   @Query('mock') mock: boolean = false,
                   @UserAbility() userAbility?: AppAbility) {
    const product = await this.productService.findById(productId);
    if (!product) {
      throw new NotFoundException();
    }
    PermissionsHelperService.canReadOrThrow(product, userAbility);
    if (!product.providers.length) {
      throw new BadRequestException('Product has no price providers');
    }
    return await this.productService.scanPricesInQueue(productId, { mock, trigger: ScanTrigger.Manual } );
  }

  // TODO validate form
  @Put(':id/provider-form/:providerSlug/:command')
  async setProviderForm(@Param('id', IsMongoIdPipe) productId: string,
                        @Param('providerSlug') providerSlug: string,
                        @Param('command') command: string,
                        @Body() form: any,
                        @UserAbility() userAbility?: AppAbility) {
    await PermissionsHelperService.canUpdateOrThrowAsync(this.productService.findById(productId), userAbility);
    return this.productService.setProviderForm(productId, providerSlug, command, form);
  }

  @Delete(':id/provider-form/:providerSlug/:command')
  async removeProviderForm(@Param('id', IsMongoIdPipe) productId: string,
                           @Param('providerSlug') providerSlug: string,
                           @Param('command') command: string,
                           @UserAbility() userAbility?: AppAbility) {
    await PermissionsHelperService.canUpdateOrThrowAsync(this.productService.findById(productId), userAbility);
    return this.productService.removeProviderForm(productId, providerSlug, command);
  }

}
