import { ApiPropertyOptional } from "@nestjs/swagger";
import { INFLUX_TIME_REGEX } from "src/constants";
import { IsInfluxTime } from "src/utility";

export class StartFilterDTO {
  @IsInfluxTime()
  @ApiPropertyOptional({
    type: String,
    example: "-2d",
    description:
      "Start date since the last stored read. Can be a negative duration or a date-string. Examples: -1d, -1y12m, 2022-04-01T00:00:00Z",
    pattern: INFLUX_TIME_REGEX,
  })
  start: string;
}
