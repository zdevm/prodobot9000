import { Body, Controller, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './services/product/product.service';

@Controller('products')
export class ProductController {

  public constructor(private productService: ProductService) {}

  @Post()
  create(@Body(ValidationPipe) dto: CreateProductDto) {
    return this.productService.create(dto)
  }

  @Get(':id/scan-prices')
  scanPrices(@Param('id') productId: string) {
    return this.productService.scanPrices(productId);
  }

  @Put(':id/provider-form/:providerSlug/:command')
  setProviderForm(@Param('id') productId: string,
                  @Param('providerSlug') providerSlug: string,
                  @Param('command') command: string,
                  @Body() form: any) {
    return this.productService.setProviderForm(productId, providerSlug, command, form);
  }

}
