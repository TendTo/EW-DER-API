import { ApiProperty } from "@nestjs/swagger";
import { DID_REGEX } from "src/constants";
import { IsDID } from "src/utility";

export class DIDDTO {
  @IsDID()
  @ApiProperty({
    type: String,
    example: "did:ethr:0x1234567890123456789012345678901234567890",
    description: "DID of the asset",
    pattern: DID_REGEX,
  })
  assetDID: string;
}
