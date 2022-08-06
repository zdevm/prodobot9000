import { mongooseCommonSchemaOptions } from "@configurations/mongoose-schema-options";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Document } from "mongoose";

const stringProp = { type: SchemaTypes.String, required: true };
const stringPropIndexed = { type: SchemaTypes.String, required: true, index: true };

export type FileDocument = MongooseFile & Document;

@Schema({ ...mongooseCommonSchemaOptions, collection: 'files' })
export class MongooseFile {

    @Prop({ ...stringPropIndexed })
    filename: string;

    @Prop(stringProp)
    fullPath: string;

    @Prop(stringProp)
    ext: string;

    @Prop({ ...stringProp, required: false })
    mimeType: string | null;

    @Prop(stringPropIndexed)
    storage: 'local';
}

export const FileSchema = SchemaFactory.createForClass(MongooseFile);