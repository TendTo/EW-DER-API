import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { IsInfluxDuration } from "src/utility";
import { AggregationFunction, INFLUX_DURATION_REGEX } from "../../constants";
import { ReadingsFilterDTO } from "../../readings/dto";

export class AggregateReadingsFilterDTO extends ReadingsFilterDTO {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiProperty({
    type: Boolean,
    description:
      'When "true" it will calculate the difference between reads before applying aggregation functions',
    default: false,
  })
  difference: boolean = false;

  @IsOptional()
  @IsInfluxDuration()
  @ApiPropertyOptional({
    description: "Aggration time window. Examples: 1d, 3mo, 4h5m1s",
    type: String,
    default: "1h",
    pattern: INFLUX_DURATION_REGEX,
  })
  aggregationWindow: string = "1h";

  @IsOptional()
  @IsEnum(AggregationFunction)
  @ApiPropertyOptional({
    description:
      "Aggregation function to apply to the readings. aggregationWindow must be set",
    enum: AggregationFunction,
    default: AggregationFunction.mean,
  })
  aggregationFunction: AggregationFunction = AggregationFunction.mean;
}
