import { PreciseProofDTO } from "src/precise-proofs/dto";
import { getMinMax } from "src/utility";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Status } from "../../constants";
import { Reading } from "./reading.entity";

@Entity()
export class AggregatedReadings extends BaseEntity {
  constructor();
  constructor(
    preciseProof: PreciseProofDTO,
    readings: Reading[],
    status?: Status,
  );
  constructor(
    preciseProof?: PreciseProofDTO,
    readings?: Reading[],
    status: Status = Status.NotSubmitted,
  ) {
    super();
    if (!preciseProof || !readings) return;
    const { rootHash, salts, signature, hashedRootHash } = preciseProof;
    const [start, stop] = getMinMax(readings, "timestamp");
    this.rootHash = rootHash;
    this.salts = salts;
    this.signature = signature;
    this.hashedRootHash = hashedRootHash;
    this.readings = readings;
    this.status = status;
    this.start = start.timestamp;
    this.stop = stop.timestamp;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rootHash: string;

  @Column()
  hashedRootHash: string;

  @Column()
  signature: string;

  @Column("text", { array: true })
  salts: string[];

  @Column()
  status: Status;

  @Column()
  start: Date;

  @Column()
  stop: Date;

  @OneToMany(() => Reading, (reading) => reading.aggregatedReadings)
  readings: Reading[];

  public get dto() {
    return {
      rootHash: this.rootHash,
      salts: this.salts,
      status: this.status,
      start: this.start,
      stop: this.stop,
      readings: this.readings.map((reading) => reading.dto),
      signature: this.signature,
    };
  }
}
