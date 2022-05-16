import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from "class-validator";
import { IsInfluxDuration } from "src/utility";
import {
  AggregationFunction,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  INFLUX_DURATION_REGEX,
  Order,
} from "../../constants";
import { RangeFilterDTO } from "./rangeFilter.dto";

export class ReadingsFilterDTO extends RangeFilterDTO {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(10000)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: "The maximum number of readings to return",
    type: "integer",
    default: DEFAULT_LIMIT,
    minimum: 0,
    maximum: 10000,
  })
  limit = DEFAULT_LIMIT;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: "Offset of the sliding window applied to the list of readings",
    type: "integer",
    default: DEFAULT_OFFSET,
    minimum: 0,
  })
  offset = DEFAULT_OFFSET;

  @IsOptional()
  @IsEnum(Order)
  @ApiPropertyOptional({
    description: "Order of the readings, based on the timestamp",
    enum: Order,
    default: Order.ASC,
  })
  order: Order = Order.ASC;

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
