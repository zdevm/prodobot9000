import { mongooseCommonSchemaOptions } from "@configurations/mongoose-schema-options";
import { ProductRate } from "@modules/product-rate/classes/product-rate";
import { MongooseProductRate } from "@modules/product-rate/schemas/product-rate.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";
import { ScanStatus } from "../enums/scan-status.enum";
import { ScanTrigger } from "../enums/scan-trigger.enum";

export type ScanDocument = MongooseScan & Document;

@Schema(mongooseCommonSchemaOptions)
export class MongooseScan {
  
  @Prop({ type: SchemaTypes.ObjectId, required: true, index: true })
  product: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
    enum: ScanStatus,
    index: true,
    default: () => ScanStatus.Pending
  })
  status: ScanStatus

  @Prop({
    type: SchemaTypes.String,
    required: true,
    enum: ScanTrigger,
  })
  trigger: ScanTrigger

  @Prop({ type: [SchemaTypes.String], required: true })
  providersToScan: string[]; // slugs

  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: MongooseProductRate.name,
    default: () => []
  })
  rates: ProductRate[];

  @Prop({
    type: SchemaTypes.Date,
  })
  completedAt: Date;

}

export const ScanSchema = SchemaFactory.createForClass(MongooseScan);