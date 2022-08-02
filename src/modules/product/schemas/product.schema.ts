import { mongooseCommonSchemaOptions } from "@configurations/mongoose-schema-options";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type ProductDocument = MongooseProduct & Document;

@Schema({
  ...mongooseCommonSchemaOptions,
  collection: 'products'
})
export class MongooseProduct {

  @Prop({ type: SchemaTypes.String, required: true })
  name: string;

  @Prop({ type: SchemaTypes.String, required: false, default: () => '' })
  description: string;

  @Prop({ type: [SchemaTypes.String] })
  providers: string[];

  @Prop({ type: SchemaTypes.Mixed })
  providersForms: any;

}

export const ProductSchema = SchemaFactory.createForClass(MongooseProduct);

ProductSchema.plugin(mongoosePaginate);