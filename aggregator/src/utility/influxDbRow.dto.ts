import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { IsDID } from "./validators";

export class InfluxDbRowDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    example: "0xef131ed1460626e97F34243DAc544B42eb52a472",
    description:
      "Root hash calculated by the prosumer and to be confirmed by the validator, before being sent to the blockchain",
  })
  rootHash?: string;

  @IsOptional()
  @IsDID()
  @ApiProperty({
    type: String,
    example: "did:ethr:0x1234567890123456789012345678901234567890",
    description: "DID of the asset",
  })
  assetDID?: string;

  @IsString()
  @ApiProperty({
    type: String,
    example: "_result",
    description: "Sucessful query",
  })
  result: "_result";

  @IsNumber()
  @ApiProperty({
    type: "integer",
    example: 0,
    description: "Table query index",
  })
  table: number;
}
