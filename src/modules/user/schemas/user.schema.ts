import { mongooseCommonSchemaOptions } from "@configurations/mongoose-schema-options";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";

export type UserDocument = MongooseUser & Document;

@Schema({...mongooseCommonSchemaOptions, collection: 'users'})
export class MongooseUser {

  @Prop({ type: SchemaTypes.String, required: true })
  firstName: string;

  @Prop({ type: SchemaTypes.String, required: true })
  lastName: string;

  @Prop({ type: SchemaTypes.String, required: true, unique: true })
  email: string;

  @Prop({ type: SchemaTypes.Date })
  verifiedAt: Date;

}

export const UserSchema = SchemaFactory.createForClass(MongooseUser);