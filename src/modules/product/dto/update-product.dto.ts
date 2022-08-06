import { IsMongoId, IsOptional, IsString } from "class-validator";

export class UpdateProductDto {

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsMongoId()
  @IsOptional()
  image?: string;

}