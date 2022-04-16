import { Module, CacheModule } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { BlockchainService } from "src/blockchain/blockchain.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    CacheModule.register({ ttl: 60 }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1d" },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, BlockchainService, JwtStrategy],
})
export class AuthModule {}
