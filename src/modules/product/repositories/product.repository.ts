import { InjectModel } from "@nestjs/mongoose";
import { plainToInstance } from "class-transformer";
import { Model } from "mongoose";
import { Product } from "../classes/product";
import { CreateProductDto } from "../dto/create-product.dto";
import { MongooseProduct, ProductDocument } from "../schemas/product.schema";

export class ProductRepository {

  @InjectModel(MongooseProduct.name)
  model: Model<ProductDocument>;

  create(dto: CreateProductDto) {
    return this.model.create(dto).then(doc => ProductRepository.transform(doc));
  }
  
  findById(id: string) {
    return this.model.findById(id).then(doc => ProductRepository.transform(doc));
  }

  /**
   * Deletes specified product.
   * @param id 
   * @returns Deleted product
  */
  deleteById(id: string) {
    return this.model.findByIdAndRemove(id, { lean: true }).then(ProductRepository.transform)
  }

  /**
   * 
   * @param id 
   * @param partial 
   * @returns Updated product.
   */
  updateById(id: string, partial: Partial<Product>): Promise<Product> {
    return this.model.findOneAndUpdate({_id: id}, partial, { new: true, lean: true })
                     .then(doc => {
                      if (!doc) { // failed to find or update 
                        throw new Error('Failed to update document');
                      }
                      return ProductRepository.transform(doc);
                     });
  }

  static transform(doc: ProductDocument) {
    if (!doc) {
      return undefined;
    }
    let plain = doc; 
    if (doc.toObject) {
      plain = doc.toObject();
    }
    return plainToInstance(Product, plain, { excludeExtraneousValues: true });
  }

}