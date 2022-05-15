import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { BlockchainService } from "src/blockchain/blockchain.service";
import { isTypeArray } from "src/utility";

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
      query: { assetDIDs },
    }: Request<{ assetDID?: string }, {}, { assetDIDs?: string[] }>,
    { address, exp }: ParsedJwt,
  ) {
    const isArrayQuery = isTypeArray(assetDIDs, "string");

    if (assetDID && !this.blockchainService.isDID(assetDID))
      throw new HttpException("Invalid assetDID", HttpStatus.BAD_REQUEST);
    if (isArrayQuery && !assetDIDs.every(this.blockchainService.isDID))
      throw new HttpException("Invalid assetDIDs", HttpStatus.BAD_REQUEST);

    // Is the aggregator
    if (this.blockchainService.aggregatorAddress === address) return { address, exp };

    if (assetDID && (await this.blockchainService.isOwner(address, assetDID)))
      return { address, exp };
    if (isArrayQuery && (await this.blockchainService.isOwner(address, assetDIDs)))
      return { address, exp };

    throw new HttpException(
      "The address this JWT belongs to is not the owner of the asset",
      HttpStatus.FORBIDDEN,
    );
  }
}
