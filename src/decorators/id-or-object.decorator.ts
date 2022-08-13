import { applyDecorators } from "@nestjs/common";
import { plainToInstance, Transform } from "class-transformer";
import mongoose from "mongoose";

export function StringIdOrInstanceTransform(classType: new (...args) => any) {
  return Transform(data => {
    const propValue = data?.obj?.[data.key];
    if (!propValue) { // is falsy
      return propValue;
    } else if (mongoose.isObjectIdOrHexString(propValue)) { // is mongo id
      if (Array.isArray(propValue)) { // array of ids
        return propValue.map(id => id.toString())
      } else {
        return propValue.toString();
      }
    } else { // is populated plain
      return plainToInstance(classType, propValue, { excludeExtraneousValues: true })
    }
  })
}