import { mongooseCommonSchemaOptions } from "@configurations/mongoose-schema-options";
import { User } from "@modules/user/classes/user";
import { MongooseUser } from "@modules/user/schemas/user.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";

export type MagicCodeAuthDocument = MongooseMagicCodeAuth & Document;

@Schema({...mongooseCommonSchemaOptions, collection: 'magicodeauths'})
export class MongooseMagicCodeAuth {

  @Prop({ type: SchemaTypes.String, required: true })
  code: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: MongooseUser.name, required: true, index: true })
  user: string | User;

  @Prop({ type: SchemaTypes.Date, default: () => null })
  verifiedAt: Date | null;

  @Prop({ type: SchemaTypes.Number, default: () => 0 })
  attempts: number; // if attempts equal maxAttempts and verifiedAt is still null, magic code is invalidated

  @Prop({ type: SchemaTypes.Number, default: () => 3 })
  maxAttempts: number;

  @Prop({ type: SchemaTypes.Date })
  expiresAt?: Date;

}

export const MagicCodeAuthSchema = SchemaFactory.createForClass(MongooseMagicCodeAuth);