import { Inject } from "@nestjs/common";
import { JwtRepositoryInjectionToken } from "../constants/jwt-repostiroty";

export function InjectJwtRepository() {
    return Inject(JwtRepositoryInjectionToken);
}