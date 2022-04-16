import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";
import { randomBytes } from "crypto";
import { JWTDTO, JWTRequestDTO, NonceDTO } from "./dto";

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jwtService: JwtService,
  ) {}

  async generateNonce(address: string): Promise<NonceDTO> {
    const nonce = randomBytes(32).toString("base64");
    await this.cacheManager.set(address, nonce);
    return { nonce };
  }

  async login({ address, signedNonce }: JWTRequestDTO): Promise<JWTDTO> {
    const sign = this.jwtService.sign({ address, signedNonce });
    await this.cacheManager.del(address);
    return { jwt: sign };
  }
}
