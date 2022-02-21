import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNumber } from "class-validator";

export class ReadingDTO {
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    type: String,
    format: "date-time",
    example: "2020-01-01T00:00:00Z",
    description: "Measurement timestamp",
  })
  timestamp: Date;

  @IsNumber()
  @ApiProperty({
    type: "integer",
    example: 10000000,
    description: "Measurement value in Wh",
  })
  value: number;
}
