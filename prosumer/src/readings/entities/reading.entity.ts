import { unitConverter } from "src/utility";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Unit } from "../../constants";
import { ReadingDTO } from "../dto";
import { AggregatedReadings } from "./aggregatedReadings.entity";

@Entity()
export class Reading extends BaseEntity {
  constructor(
    { assetId, timestamp, unit, value }: ReadingDTO,
    aggregatedReadings: AggregatedReadings = null,
  ) {
    super();
    this.assetId = assetId;
    this.timestamp = timestamp;
    this.value = unitConverter(value, unit);
    this.aggregatedReadings = aggregatedReadings;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  assetId: string;

  @Column()
  value: number;

  @Column()
  timestamp: Date;

  @ManyToOne(
    () => AggregatedReadings,
    (aggregatedReadings) => aggregatedReadings.readings,
    { nullable: true },
  )
  aggregatedReadings: AggregatedReadings;
}
