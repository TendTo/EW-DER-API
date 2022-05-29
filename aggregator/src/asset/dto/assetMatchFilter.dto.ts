import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { AggregationFunction, INFLUX_DURATION_REGEX } from "src/constants";
import { IsInfluxDuration } from "src/utility";

export class AssetMatchFilterDTO {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 10 })
  @Type(() => Number)
  @ApiPropertyOptional({
    description: "Assets compatible with the provided value requirement in Wh",
    type: Number,
    default: 1000,
  })
  compatibleValue?: number;

  @IsOptional()
  @IsInfluxDuration()
  @ApiPropertyOptional({
    description: "Aggregation time window. Examples: 1d, 3mo, 4h5m1s",
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
