import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from "class-validator";
import { DEFAULT_LIMIT, DEFAULT_OFFSET, Order } from "../../constants";
import { RangeFilterDTO } from "./rangeFilter.dto";

export class ReadingsFilterDTO extends RangeFilterDTO {
  @IsOptional()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsInt()
  @IsPositive()
  @Max(10000)
  @ApiPropertyOptional({
    type: "integer",
    default: DEFAULT_LIMIT,
    minimum: 0,
    maximum: 10000,
  })
  limit = DEFAULT_LIMIT;

  @IsOptional()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ type: "integer", default: DEFAULT_OFFSET, minimum: 0 })
  offset = DEFAULT_OFFSET;

  @IsString()
  @IsEnum(Order)
  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  order: "ASC" | "DESC" = "ASC";
}
