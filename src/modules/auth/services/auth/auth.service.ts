import { InjectJwtRepository } from '@modules/jwt/decorators/inject-jwt-repository.decorator';
import { JwtRepository } from '@modules/jwt/repositories/jwt.interface';
import { User } from '@modules/user/classes/user';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HelperService } from '@services/helper.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly refreshTokenDuration = '7d';
  private readonly accessTokenDuration = '30m';

  public constructor(private readonly jwtService: JwtService,
                     @InjectJwtRepository() private readonly jwtRepository: JwtRepository) {}

  async auth(user: User) {
    const userId = this.extractUserIdOrThrow(user);
    const accessTokenId = this.generateJwtKey();
    const accessToken = this.generateAccessToken(userId, accessTokenId);
    await this.storeAccessTokenOrThrow(accessTokenId, accessToken);
    const refreshToken = this.generateRefreshToken(accessTokenId);
    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    const accessTokenId = this.extractAccessIdFromRefreshTokenOrThrow(refreshToken);
    const accessPayload = await this.getAccessPayloadFromIdOrThrow(accessTokenId);
    const newAccessToken = this.generateAccessToken(accessPayload.sub, accessTokenId);
    return newAccessToken;
  }

  async revoke(accessToken: string) {
    const accessPayload = <{ sub: string; jti: string; }>this.jwtService.decode(accessToken);
    if (!accessPayload.jti) {
      throw new Error('Access token is malformed');
    }
    return this.jwtRepository.delete(accessPayload.jti);
  }

  private async getAccessPayloadFromIdOrThrow(accessTokenId: string) {
    const payload = await this.jwtRepository.retrieve<{sub: string; jwtid: string}>(accessTokenId)
    if (!payload) {
      throw new Error('Specified token does not exist!');
    }
    return payload;
  }

  private extractAccessIdFromRefreshTokenOrThrow(refreshToken: string) {
    const refreshPayload: { sub: string } = <any>this.jwtService.decode(refreshToken);
    if (typeof refreshPayload !== 'object' || !refreshPayload.sub) {
      throw new Error('Refresh token is malformed')
    }
    return refreshPayload.sub;
  }

  private generateRefreshToken(accessTokenId: string) {
    return this.jwtService.sign({}, { subject: accessTokenId, expiresIn: this.refreshTokenDuration  });
  }

  private storeAccessTokenOrThrow(id: string, token: string) {
    return this.jwtRepository.store(this.jwtService.decode(token), id);
  }

  private generateAccessToken(userId: string, tokenId: string) {
    return this.jwtService.sign({}, { subject: userId, jwtid: tokenId, expiresIn: this.accessTokenDuration });
  }

  private extractUserIdOrThrow(user: User) {
    const userId = HelperService.id(user)
    if (!userId) {
      throw new Error('Failed to auth user: ID is required.');
    }
    return userId;
  }

  private generateJwtKey() {
    return uuidv4(); 
  }



}
