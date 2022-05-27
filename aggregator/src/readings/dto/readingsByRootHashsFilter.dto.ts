import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsOptional,
} from "class-validator";
import { BaseReadingFilter } from "./baseReadingFilter.dto";

export class ReadingsByRootHashesFilterDTO extends BaseReadingFilter {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @Type(() => String)
  @ApiProperty({
    type: String,
    example: "0xed61917ef0ee86c9bcaa4a8db86ea2afe5b9081f19e26c66dd9aa43564024440",
    description: "DID of the asset",
    isArray: true,
  })
  rootHashes: string[];

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    type: Boolean,
    description:
      'When "true" it will calculate the difference between reads before applying aggregation functions',
    default: false,
  })
  difference: boolean = false;
}
