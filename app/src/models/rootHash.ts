import { ISingleValueModel } from "./ISingleValueModel";
import { BaseRepository } from "./repository";

type RootHashDTO = string;
type RootHashQueryOptions = {
  assetDIDs?: string[];
  limit?: number;
  offset?: number;
  start: string;
  stop?: string;
};

export class RootHash implements ISingleValueModel<string> {
  static readonly repository = new BaseRepository();

  constructor(public readonly rootHash: string) {}

  get singleValue(): string {
    return this.rootHash;
  }

  public static async get(options: RootHashQueryOptions) {
    console.log(options);
    const json = await this.repository.fetchJson<RootHashDTO[]>(`assets/rootHashes`, {
      method: "POST",
      body: { ...options },
    });
    return json.map((rootHash) => new this(rootHash));
  }
}
