import { IsEmail, IsNumberString } from "class-validator";

export class FinishValidationDto {

  @IsNumberString()
  code: string;
  
}