import { mongooseCommonSchemaOptions } from "@configurations/mongoose-schema-options";
import { MongooseFile } from "@modules/upload/schemas/file.schema";
import { MongooseUser } from "@modules/user/schemas/user.schema";
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

  @Prop({ type: [SchemaTypes.String], default: () => [] })
  providers: string[];

  @Prop({ type: SchemaTypes.Mixed, default: () => ({}) })
  providersForms: any;

  @Prop({ type: SchemaTypes.ObjectId, ref: MongooseFile.name })
  image: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: MongooseUser.name, required: true, index: true })
  user: string;

}

export const ProductSchema = SchemaFactory.createForClass(MongooseProduct);

ProductSchema.plugin(mongoosePaginate);