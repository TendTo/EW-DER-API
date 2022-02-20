import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  Validate,
} from "class-validator";
import { DEFAULT_LIMIT, DEFAULT_OFFSET, Order } from "../constants";
import { IsBeforeConstraint } from "../validators/isBeforeContraint";

export class FilterDTO {
  @IsDateString()
  @Validate(IsBeforeConstraint, ["end"])
  @ApiProperty({ format: "date-time", example: "2020-01-01T00:00:00Z" })
  start: string;

  @IsDateString()
  @ApiProperty({ format: "date-time", example: "2020-01-02T00:00:00Z" })
  end: string;

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
