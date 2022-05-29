import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, Max, Min } from "class-validator";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "src/constants";

export class LimitFilterDTO {
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
}
