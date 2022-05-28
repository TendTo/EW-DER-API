import { BaseRepository } from "./repository";

export const aggregationFunctions = [
  "mean",
  "sum",
  "last",
  "max",
  "min",
  "count",
] as const;

type DID = `did:ethr:0x${string}`;
type Address = `0x${string}`;
type Order = "ASC" | "DESC";
export type AggregationFunction = typeof aggregationFunctions[number];

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

type AggregatedReadingsDTO = ReadingsDTO & {
  start: string;
  stop: string;
};

export type AggregatedReadingsDTOOptions = {
  start: string;
  stop?: string;
  limit?: number;
  offset?: number;
  order?: Order;
  difference: boolean;
  aggregationWindow?: string;
  aggregationFunction?: AggregationFunction;
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
      `readings/roothash/${encodeURIComponent(rootHash)}`,
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

  public static async getAggregatedReadingsByAssetDID(
    assetDID: string,
    options: AggregatedReadingsDTOOptions,
  ) {
    const json = await this.repository.fetchJson<AggregatedReadingsDTO[]>(
      `aggregated-readings/assetDID/${encodeURIComponent(assetDID)}`,
      {
        queryParams: options,
      },
    );
    return json.map(this.dtoMapper);
  }

  public static async getManyAggregatedReadingsByAssetDID(
    assetDIDs: string[],
    options: AggregatedReadingsDTOOptions,
  ) {
    const json = await this.repository.fetchJson<AggregatedReadingsDTO[]>(
      `aggregated-readings/assetDID`,
      {
        method: "POST",
        body: { ...options, assetDIDs },
      },
    );
    return json.map(this.dtoMapper);
  }

  public static async getAggregatedReadingsByRootHash(
    rootHash: string,
    options: AggregatedReadingsDTOOptions,
  ) {
    const json = await this.repository.fetchJson<AggregatedReadingsDTO[]>(
      `aggregated-readings/roothash/${encodeURIComponent(rootHash)}`,
      {
        queryParams: options,
      },
    );
    return json.map(this.dtoMapper);
  }

  public static async getManyAggregatedReadingsByRootHash(
    rootHashes: string[],
    options: AggregatedReadingsDTOOptions,
  ) {
    const json = await this.repository.fetchJson<AggregatedReadingsDTO[]>(
      `aggregated-readings/roothash`,
      {
        method: "POST",
        body: { ...options, rootHashes },
      },
    );
    return json.map(this.dtoMapper);
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
