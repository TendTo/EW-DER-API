import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayNotEmpty, ArrayUnique, IsArray } from "class-validator";
import { DID_REGEX } from "src/constants";
import { IsDID, LimitFilterDTO, RangeFilterDTO } from "src/utility";

export class AssetFilterDTO extends IntersectionType(RangeFilterDTO, LimitFilterDTO) {
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
}
