import { BaseRepository } from "./repository";

type DID = `did:ethr:0x${string}`;
type Address = `0x${string}`;
type Order = "ASC" | "DESC";

type ReadingsDTO = {
  assetDID: DID;
  rootHash: Address;
  timestamp: string;
  value: number;
};

export type ReadingsDTOOptions = {
  start: string;
  stop?: string;
  limit?: number;
  offset?: number;
  order?: Order;
};

export class Reading {
  static readonly repository = new BaseRepository();

  constructor(
    public readonly assetDID: DID,
    public readonly assetOwner: Address,
    public readonly rootHash: Address,
    public readonly volume: number,
    public readonly timestamp: Date,
    public readonly verified: boolean = false, // TODO: verified shall check logs
  ) {}

  private static dtoMapper(dto: ReadingsDTO) {
    return new Reading(
      dto.assetDID,
      "0x",
      dto.rootHash,
      dto.value,
      new Date(dto.timestamp),
    );
  }

  public static async getByAssetDID(assetDID: string, options: ReadingsDTOOptions) {
    const json = await this.repository.fetchJson<ReadingsDTO[]>(
      `readings/assetDID/${encodeURIComponent(assetDID)}`,
      {
        queryParams: options,
      },
    );
    return json.map(this.dtoMapper);
  }

  public static async getManyByAssetDID(
    assetDIDs: string[],
    options: ReadingsDTOOptions,
  ) {
    const json = await this.repository.fetchJson<ReadingsDTO[][]>(`readings/assetDID`, {
      method: "POST",
      body: { ...options, assetDIDs },
    });
    return json.map((readings: ReadingsDTO[]) => readings.map(this.dtoMapper));
  }

  public static async getByRootHash(rootHash: string, options: ReadingsDTOOptions) {
    const json = await this.repository.fetchJson<ReadingsDTO[]>(
      `/readings/roothash/${encodeURIComponent(rootHash)}`,
      { queryParams: options },
    );
    return json.map(this.dtoMapper);
  }

  public static async getManyByRootHash(
    rootHashes: string[],
    options: ReadingsDTOOptions,
  ) {
    const json = await this.repository.fetchJson<ReadingsDTO[][]>(`readings/roothash`, {
      method: "POST",
      body: { ...options, rootHashes },
    });
    return json.map((readings: ReadingsDTO[]) => readings.map(this.dtoMapper));
  }

  public static async getLast(
    assetDID: string,
    options: Pick<ReadingsDTOOptions, "start">,
  ) {
    const json = await this.repository.fetchJson<ReadingsDTO>(
      `readings/${encodeURIComponent(assetDID)}/latest`,
      {
        queryParams: options,
      },
    );
    return this.dtoMapper(json);
  }

  public clone(): Reading {
    return new Reading(
      this.assetDID,
      this.assetOwner,
      this.rootHash,
      this.volume,
      this.timestamp,
    );
  }

  get unixTimestamp(): number {
    return this.timestamp.getTime();
  }
}
