import { Module } from "@nestjs/common";
import { ConfigurableModule } from "src/utility";
import { BlockchainService } from "./blockchain.service";

@Module({
  providers: [BlockchainService],
  exports: [BlockchainService],
})
export class BlockchainModule extends ConfigurableModule {
  protected static defaultExports = [BlockchainService];
  protected static defaultProviders = [BlockchainService];
}
