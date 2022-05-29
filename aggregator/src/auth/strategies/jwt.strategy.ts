import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { BlockchainService } from "src/blockchain/blockchain.service";

type ParsedJwt = {
  address: string;
  signedNonce: string;
  iat: number;
  exp: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly blockchainService: BlockchainService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
      passReqToCallback: true,
    });
  }

  async validate(
    {
      params: { assetDID },
      body: { assetDIDs },
    }: Request<{ assetDID?: string }, undefined, { assetDIDs?: string[] }>,
    { address, exp }: ParsedJwt,
  ) {
    if (assetDID && !this.blockchainService.isDID(assetDID))
      throw new HttpException("Invalid assetDID", HttpStatus.BAD_REQUEST);
    if (Array.isArray(assetDIDs) && !assetDIDs.every(this.blockchainService.isDID))
      throw new HttpException("Invalid assetDIDs", HttpStatus.BAD_REQUEST);

    // Is the aggregator
    if (this.blockchainService.isAggregator(address)) return { address, exp };

    // The prosumer is not the aggregator and is not allowed to access the DIDs he doesn't own
    if (
      (assetDID && !(await this.blockchainService.isOwner(address, assetDID))) ||
      (Array.isArray(assetDIDs) &&
        !(await this.blockchainService.isOwner(address, assetDIDs)))
    )
      throw new HttpException(
        "The address this JWT belongs to is not the owner of the asset",
        HttpStatus.FORBIDDEN,
      );

    return { address, exp };
  }
}
