import { unitConverter } from "src/utility";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ReadingDTO } from "../dto";
import { AggregatedReadings } from "./aggregatedReadings.entity";

@Entity()
export class Reading extends BaseEntity {
  constructor();
  constructor(readingDTO: ReadingDTO, aggregatedReadings?: AggregatedReadings);
  constructor(readingDTO?: ReadingDTO, aggregatedReadings: AggregatedReadings = null) {
    super();
    if (!readingDTO) return;
    const { assetDID, timestamp, unit, value } = readingDTO;
    this.assetDID = assetDID;
    this.timestamp = timestamp;
    this.value = unitConverter(value, unit);
    this.aggregatedReadings = aggregatedReadings;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  assetDID: string;

  @Column()
  value: number;

  @Column()
  timestamp: Date;

  @Column({ nullable: true })
  aggregatedReadingsId: number;

  @ManyToOne(
    () => AggregatedReadings,
    (aggregatedReadings) => aggregatedReadings.readings,
    {
      nullable: true,
    },
  )
  aggregatedReadings: AggregatedReadings;

  public get dto() {
    return {
      assetDID: this.assetDID,
      value: this.value,
      timestamp: this.timestamp,
    };
  }
}
