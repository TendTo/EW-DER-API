import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from "class-validator";
import { DEFAULT_LIMIT, DEFAULT_OFFSET, DID_REGEX } from "src/constants";
import { IsDID } from "src/utility";
import { RangeFilterDTO } from "./rangeFilter.dto";

export class ListingFilterDTO extends RangeFilterDTO {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @Type(() => String)
  @IsDID({ each: true })
  @ApiProperty({
    type: String,
    example: ["did:ethr:0x1234567890123456789012345678901234567890"],
    description: "DID of the asset",
    isArray: true,
    items: { pattern: DID_REGEX },
  })
  assetDIDs: string[];

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
