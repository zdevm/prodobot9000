import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt.guard";

export function JwtGuard() {
  return UseGuards(JwtAuthGuard);
}