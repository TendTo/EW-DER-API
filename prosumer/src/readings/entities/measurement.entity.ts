import { Status, Unit } from "src/constants";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class Measurement extends BaseEntity {
  constructor(
    timestamp: Date,
    value: number,
    unit: Unit,
    status: Status = Status.NotSubmitted,
  ) {
    super();
    this.timestamp = timestamp;
    this.value = value;
    this.unit = unit;
    this.status = status;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number;

  @Column()
  timestamp: Date;

  @Column()
  unit: Unit;

  @Column()
  status: Status;
}
