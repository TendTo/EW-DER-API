import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";
import { IsDID } from "src/utility";

export class ReadingDTO {
  @IsDID()
  @ApiProperty({
    type: String,
    example: "did:ethr:0x1234567890123456789012345678901234567890",
    description: "DID of the asset",
  })
  assetDID: string;

  @IsString()
  @ApiProperty({
    type: String,
    example:
      "0x6a2d994fb3bfbb568f940a7fd3a2f43555858a001fb5f2783cc76335431b93c1",
    description:
      "Root hash calculated by the prosumer and to be confirmed by the validator, before being sent to the blockchain",
  })
  rootHash: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    type: String,
    format: "date-time",
    example: "2020-01-01T00:00:00Z",
    description: "Measurement timestamp",
  })
  timestamp: Date;

  @IsNumber()
  @ApiProperty({
    type: "integer",
    example: 10000000,
    description: "Measurement value in Wh",
  })
  value: number;
}
