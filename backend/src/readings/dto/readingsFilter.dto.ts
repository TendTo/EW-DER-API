import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from "class-validator";
import { DEFAULT_LIMIT, DEFAULT_OFFSET, Order } from "../../constants";
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
    description: "Offset of the sliding window applyed to the list of readings",
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
}
