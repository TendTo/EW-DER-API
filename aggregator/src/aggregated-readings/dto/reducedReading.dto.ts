import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNumber } from "class-validator";
import { IsDID } from "src/utility";

export class ReducedReadingDTO {
  @IsDID()
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
  timestamp: Date;

  @IsNumber()
  @ApiProperty({
    type: "integer",
    example: 10000000,
    description: "Measurement value in Wh",
  })
  value: number;

  public toString() {
    return `ReadingDTO {
      assetDID: ${this.assetDID},
      timestamp: ${this.timestamp},
      value: ${this.value}
    }`;
  }
}
