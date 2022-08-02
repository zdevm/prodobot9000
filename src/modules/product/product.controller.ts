import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { IsMongoIdPipe } from 'src/pipes/is-mongo-id.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './services/product/product.service';

@Controller('products')
export class ProductController {

  public constructor(private productService: ProductService) {}

  @Get(':id')
  async getProduct(@Param('id', IsMongoIdPipe) productId: string) {
    const product = await this.productService.findById(productId)
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }

  @Post()
  create(@Body(ValidationPipe) dto: CreateProductDto) {
    return this.productService.create(dto)
  }

  @Delete(':id')
  async delete(@Param('id', IsMongoIdPipe) id: string) {
    const deleted = await this.productService.deleteById(id);
    if (!deleted) {
      throw new NotFoundException();
    }
    return deleted;
  }

  @Get(':id/scan-prices')
  scanPrices(@Param('id', IsMongoIdPipe) productId: string) {
    return this.productService.scanPrices(productId);
  }

  @Put(':id/provider-form/:providerSlug/:command')
  setProviderForm(@Param('id', IsMongoIdPipe) productId: string,
                  @Param('providerSlug') providerSlug: string,
                  @Param('command') command: string,
                  @Body() form: any) {
    return this.productService.setProviderForm(productId, providerSlug, command, form);
  }

}
