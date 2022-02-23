import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNumber } from "class-validator";
import { Unit } from "../../constants";

export class MeasurementDTO {
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

  @IsEnum(Unit)
  @ApiProperty({ enum: Unit, enumName: "Unit" })
  unit: Unit;
}
