import { IsAlpha, IsEmail } from "class-validator";

export class RegisterUserDto {

  @IsAlpha()
  firstName: string;

  @IsAlpha()
  lastName: string;

  @IsEmail()
  email: string;

}
