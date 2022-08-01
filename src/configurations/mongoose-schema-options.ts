import { SchemaOptions } from "@nestjs/mongoose";

export const mongooseCommonSchemaOptions: SchemaOptions = {
    id: true,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}