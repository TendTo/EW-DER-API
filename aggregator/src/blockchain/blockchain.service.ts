import { NonceManager } from "@ethersproject/experimental";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { utils, Wallet } from "ethers";
import { AggregatedReadingsDTO } from "src/aggregated-readings/dto";
import { ReducedReadingDTO } from "src/aggregated-readings/dto/reducedReading.dto";
import { Config, DID_REGEX, VOLTA_CHAIN } from "src/constants";
import { getAddressFromDID, isTypeArray } from "src/utility";
import {
  IdentityManager,
  IdentityManager__factory,
  ReadingsNotary,
  ReadingsNotary__factory,
} from "./typechain";

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private readonly wallet: Wallet;
  private readonly manager: NonceManager;
  private readonly identityManager: IdentityManager;
  private readonly notary: ReadingsNotary;

  constructor(private readonly configService: ConfigService) {
    const provider = new JsonRpcProvider(
      this.configService.get(Config.VOLTA_URL) ?? "https://volta-rpc.energyweb.org",
      VOLTA_CHAIN,
    );
    this.wallet = utils.isValidMnemonic(this.configService.get(Config.SK))
      ? Wallet.fromMnemonic(this.configService.get(Config.SK)).connect(provider)
      : new Wallet(this.configService.get(Config.SK), provider);
    this.manager = new NonceManager(this.wallet);

    this.identityManager = IdentityManager__factory.connect(
      this.configService.get(Config.IDENTITY_MANAGER_ADDRESS),
      this.wallet,
    );

    this.notary = ReadingsNotary__factory.connect(
      this.configService.get(Config.READINGS_NOTARY_ADDRESS),
      this.manager,
    );
  }

  isAggregator(address: string) {
    return address === this.aggregatorAddress;
  }

  get aggregatorAddress() {
    return this.wallet.address;
  }

  isDID(DID: string) {
    return new RegExp(DID_REGEX).test(DID);
  }

  isAddress(address: string) {
    return utils.isAddress(address);
  }

  getSignatureAddress(message: string, signature: string) {
    return utils.verifyMessage(message, signature);
  }

  getMeterReadingLog(rootHash: string) {
    const filter = this.notary.filters.NewMeterReading(undefined, rootHash);
    return this.notary.queryFilter(filter);
  }

  isOwner(prosumer: string, readings: ReducedReadingDTO[]): Promise<boolean>;
  isOwner(prosumer: string, readings: string[]): Promise<boolean>;
  isOwner(prosumer: string, assetDID: string): Promise<boolean>;
  isOwner(prosumer: string, DIDorReadings: string | string[] | ReducedReadingDTO[]) {
    this.logger.debug(`Check ownership of ${prosumer}`);
    if (typeof DIDorReadings === "string") {
      return this.isOwnerAssetDID(prosumer, DIDorReadings);
    } else if (isTypeArray(DIDorReadings, "string")) {
      return this.isOwnerAssetDIDs(prosumer, DIDorReadings);
    }
    return this.isOwnerReadings(prosumer, DIDorReadings as ReducedReadingDTO[]);
  }

  private isOwnerAssetDID(prosumer: string, assetDID: string) {
    const addressDID = getAddressFromDID(assetDID);
    return this.checkOwner(prosumer, addressDID);
  }

  private isOwnerAssetDIDs(prosumer: string, assetDIDs: string[]) {
    const addressDIDs = [...new Set(assetDIDs)].map((assetDID) =>
      getAddressFromDID(assetDID),
    );
    return this.checkOwner(prosumer, addressDIDs);
  }

  private isOwnerReadings(prosumer: string, readings: ReducedReadingDTO[]) {
    const addressDIDs = [...new Set(readings.map(({ assetDID }) => assetDID))].map(
      (assetDID) => getAddressFromDID(assetDID),
    );
    return this.checkOwner(prosumer, addressDIDs);
  }

  private async checkOwner(
    prosumer: string,
    addressDID: string | string[],
  ): Promise<boolean> {
    if (typeof addressDID === "string") {
      if (!this.isAddress(addressDID)) return false;
      const owner = await this.identityManager.identityOwner(addressDID);
      return owner === prosumer;
    }
    const owner = await Promise.all(
      addressDID.map(async (assetDID) => {
        if (!this.isAddress(assetDID)) return false;
        const owner = await this.identityManager.identityOwner(assetDID);
        return owner === prosumer;
      }),
    );
    return owner.every((o) => o);
  }

  async emitNewReadings(readings: AggregatedReadingsDTO) {
    this.logger.debug(`Emit new readings ${readings.rootHash}`);
    await this.notary.functions.store(readings.rootHash);
  }
}
