import { IsDate, IsNumber, IsPositive } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class AggregatedReadDTO {
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    type: String,
    format: "date-time",
    example: "2020-01-01T00:00:00Z",
    description: "Measurements start timestamp",
  })
  start: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    type: String,
    format: "date-time",
    example: "2020-01-02T00:00:00Z",
    description: "Measurements end timestamp",
  })
  stop: Date;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    type: "integer",
    example: 10000000,
    description: "Aggregated measurements value in Wh",
  })
  value: number;
}
