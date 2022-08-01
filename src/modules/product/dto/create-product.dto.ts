import { IsOptional, IsString } from "class-validator";

export class CreateProductDto {

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

}