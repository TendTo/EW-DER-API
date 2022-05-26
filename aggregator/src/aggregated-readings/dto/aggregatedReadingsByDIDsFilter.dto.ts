import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsOptional,
} from "class-validator";
import { BaseReadingFilter } from "src/readings/dto";
import { IsDID } from "src/utility";
import { DID_REGEX } from "../../constants";

export class AggregateReadingsByDIDsFilterDTO extends BaseReadingFilter {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @Type(() => String)
  @IsDID({ each: true })
  @ApiProperty({
    type: String,
    example: "did:ethr:0x1234567890123456789012345678901234567890",
    description: "DID of the asset",
    isArray: true,
    items: { pattern: DID_REGEX },
  })
  assetDIDs: string[];

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
