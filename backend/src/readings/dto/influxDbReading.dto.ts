import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";

export class InfluxDbReadingDTO {
  @IsString()
  @ApiProperty({
    type: String,
    example: "0x6a2d994fb3bfbb568f940a7fd3a2f43555858a001fb5f2783cc76335431b93c1",
    description:
      "Root hash calculated by the prosumer and to be confirmed by the validator, before being sent to the blockchain",
  })
  rootHash: string;

  @IsString()
  @ApiProperty({
    type: String,
    example: "did:ethr:0x1234567890123456789012345678901234567890",
    description: "DID of the asset",
  })
  assetDID: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    type: String,
    format: "date-time",
    example: "2020-01-01T00:00:00Z",
    description: "Measurement timestamp",
  })
  _time: Date;

  @IsNumber()
  @ApiProperty({
    type: "integer",
    example: 10000000,
    description: "Measurement value in Wh",
  })
  _value: number;

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

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    type: String,
    format: "date-time",
    example: "2020-01-01T00:00:00Z",
    description: "Start window timestamp",
  })
  _start?: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    type: String,
    format: "date-time",
    example: "2020-01-01T00:00:00Z",
    description: "End window timestamp",
  })
  _stop?: Date;

  @IsString()
  @ApiProperty({
    type: String,
    example: "reading",
    description: "Field key",
  })
  _field: "reading";

  @IsString()
  @ApiProperty({
    type: String,
    example: "reading",
    description: "Measurement key",
  })
  _measurement: "reading";
}
