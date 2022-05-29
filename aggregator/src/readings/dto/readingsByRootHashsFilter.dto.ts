import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayNotEmpty, ArrayUnique, IsArray } from "class-validator";
import { ReadingsFilterDTO } from "./readingsFilter.dto";

export class ReadingsByRootHashesFilterDTO extends ReadingsFilterDTO {
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
}
