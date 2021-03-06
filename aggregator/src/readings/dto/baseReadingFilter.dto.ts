import { ApiPropertyOptional, IntersectionType } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { IsInfluxDuration, LimitFilterDTO, RangeFilterDTO } from "src/utility";
import { AggregationFunction, INFLUX_DURATION_REGEX, Order } from "../../constants";

export class BaseReadingFilter extends IntersectionType(RangeFilterDTO, LimitFilterDTO) {
  @IsOptional()
  @IsEnum(Order)
  @ApiPropertyOptional({
    description: "Order of the readings, based on the timestamp",
    enum: Order,
    default: Order.ASC,
  })
  order: Order = Order.ASC;

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
