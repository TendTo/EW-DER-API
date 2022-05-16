import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";

export class AggregatedReadingDTO {
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    type: String,
    format: "date-time",
    example: "2020-01-01T00:00:00Z",
    description: "Readings window start timestamp",
  })
  start: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    type: String,
    format: "date-time",
    example: "2020-01-02T00:00:00Z",
    description: "Readings window end timestamp",
  })
  stop: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    type: String,
    format: "date-time",
    example: "2020-01-02T00:00:00Z",
    description: "Average reading timestamp",
  })
  timestamp: Date;

  @IsString()
  @ApiPropertyOptional({
    type: String,
    example: "0x6a2d994fb3bfbb568f940a7fd3a2f43555858a001fb5f2783cc76335431b93c1",
    description:
      "Root hash calculated by the prosumer and to be confirmed by the validator, before being sent to the blockchain",
  })
  rootHash?: string;

  @IsString()
  @ApiPropertyOptional({
    type: String,
    example: "did:ethr:0x1234567890123456789012345678901234567890",
    description: "DID of the asset",
  })
  assetDID?: string;

  @IsNumber()
  @ApiProperty({
    type: "integer",
    example: 10000000,
    description: "Measurement value in Wh",
  })
  value: number;

  public toString() {
    return `AggregatedReadingDTO {
      start: ${this.start},
      stop: ${this.stop},
      timestamp: ${this.timestamp},
      rootHash: ${this.rootHash},
      assetDID: ${this.assetDID},
      value: ${this.value}
    }`;
  }
}
