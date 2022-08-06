import { mongooseCommonSchemaOptions } from "@configurations/mongoose-schema-options";
import { Currency } from "@enums/currency.enum";
import { Product } from "@modules/product/classes/product";
import { MongooseProduct } from "@modules/product/schemas/product.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Document } from "mongoose";

@Schema({...mongooseCommonSchemaOptions, collection: 'rates'})
export class MongooseProductRate {

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: MongooseProduct.name, index: true })
  product: string | Product;

  @Prop({ type: SchemaTypes.String, enum: Currency, default: () => Currency.euro })
  currency: Currency;

  @Prop({ type: SchemaTypes.Number, required: true, index: true })
  price: number;

  @Prop({ type: SchemaTypes.String, required: true, index: true })
  providerSlug: string;

}

export type ProductRateDocument = MongooseProductRate & Document;

export const ProductRateSchema = SchemaFactory.createForClass(MongooseProductRate);