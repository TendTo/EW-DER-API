import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayNotEmpty, ArrayUnique, IsArray } from "class-validator";
import { IsDID } from "src/utility";
import { DID_REGEX } from "../../constants";
import { ReadingsFilterDTO } from "./readingsFilter.dto";

export class ReadingsByDIDsFilterDTO extends ReadingsFilterDTO {
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
