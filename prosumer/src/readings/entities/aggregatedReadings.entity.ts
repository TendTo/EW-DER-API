import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Reading } from "./reading.entity";
import { Status } from "../../constants";
import { getMinMax } from "src/utility";
import { PreciseProofDTO } from "src/precise-proofs/dto";

@Entity()
export class AggregatedReadings extends BaseEntity {
  constructor(
    { rootHash, salts }: PreciseProofDTO,
    readings: Reading[],
    status: Status = Status.NotSubmitted,
  ) {
    super();
    const [start, end] = getMinMax(readings, "timestamp");
    this.rootHash = rootHash;
    this.salts = salts.join(",");
    this.readings = readings;
    this.status = status;
    this.startTimestamp = start.timestamp;
    this.endTimestamp = end.timestamp;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rootHash: string;

  @Column()
  salts: string;

  @Column()
  status: Status;

  @Column()
  startTimestamp: Date;

  @Column()
  endTimestamp: Date;

  @OneToMany(() => Reading, (reading) => reading.aggregatedReadings)
  readings: Reading[];
}
