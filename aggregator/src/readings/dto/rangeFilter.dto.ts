import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, Validate } from "class-validator";
import { INFLUX_TIME_REGEX } from "src/constants";
import { IsInfluxTime } from "src/utility";
import { IsBeforeConstraint } from "../validators";

export class RangeFilterDTO {
  @IsInfluxTime()
  @Validate(IsBeforeConstraint, ["stop"])
  @ApiProperty({
    type: String,
    description:
      "Start date since the last stored read. Can be a negative duration or a date-string. Examples: -1d, -1y12m, 2022-04-01T00:00:00Z",
    example: "2021-04-01T00:00:00Z",
    pattern: INFLUX_TIME_REGEX,
  })
  start: string;

  @IsOptional()
  @IsInfluxTime()
  @ApiPropertyOptional({
    type: String,
    default: "now",
    description:
      "Stop date since the last stored read. Can be a negative duration or a date-string. Examples: -4ms, -5s6h, 2021-04-01T00:00:00Z",
    example: "2024-01-02T00:00:00Z",
    pattern: INFLUX_TIME_REGEX,
  })
  stop: string = "now()";
}
