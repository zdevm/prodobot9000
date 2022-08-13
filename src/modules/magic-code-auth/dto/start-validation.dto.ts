import { IsEmail } from "class-validator";

export class StartValidationDto {

  @IsEmail()
  email: string;
  
}