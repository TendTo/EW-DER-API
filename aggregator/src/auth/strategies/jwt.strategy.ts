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
    { params: { assetDID } }: Request<{ assetDID: string }>,
    { address, exp }: ParsedJwt,
  ) {
    if (!this.blockchainService.isDID(assetDID))
      throw new HttpException("Invalid assetDID", HttpStatus.BAD_REQUEST);

    if (this.blockchainService.aggregatorAddress === address)
      return { address, exp };

    if (await this.blockchainService.isOwner(address, assetDID)) {
      return { address, exp };
    }

    throw new HttpException(
      "The address this JWT belongs to is not the owner of the asset",
      HttpStatus.FORBIDDEN,
    );
  }
}
