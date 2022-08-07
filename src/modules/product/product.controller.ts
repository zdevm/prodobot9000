import { PaginateOptions } from '@classes/paginate-options';
import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { IsMongoIdPipe } from 'src/pipes/is-mongo-id.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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

  @Get()
  async getProducts(@Query('page', ParseIntPipe) page: number,
                    @Query('limit', ParseIntPipe) perPage: number) {
    const paginateOptions = new PaginateOptions();
    paginateOptions.page = page;
    paginateOptions.limit = perPage;
    return this.productService.getProductsPaginated(paginateOptions);
  }

  @Post()
  create(@Body(ValidationPipe) dto: CreateProductDto) {
    return this.productService.create(dto)
  }

  @Put(':id')
  update(@Param('id', IsMongoIdPipe) id: string,
         @Body(ValidationPipe) dto: UpdateProductDto) {
    return this.productService.updateById(id, dto)
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

  // TODO validate form
  @Put(':id/provider-form/:providerSlug/:command')
  setProviderForm(@Param('id', IsMongoIdPipe) productId: string,
                  @Param('providerSlug') providerSlug: string,
                  @Param('command') command: string,
                  @Body() form: any) {
    return this.productService.setProviderForm(productId, providerSlug, command, form);
  }

  @Delete(':id/provider-form/:providerSlug/:command')
  removeProviderForm(@Param('id', IsMongoIdPipe) productId: string,
                     @Param('providerSlug') providerSlug: string,
                     @Param('command') command: string) {
    return this.productService.removeProviderForm(productId, providerSlug, command);
  }

}
