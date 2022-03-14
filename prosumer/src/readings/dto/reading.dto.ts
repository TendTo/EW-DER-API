import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNumber, IsString } from "class-validator";
import { Unit } from "../../constants";

export class ReadingDTO {
  @IsString()
  @ApiProperty({
    type: String,
    example: "0x1234567890123456789012345678901234567890",
    description: "DID of the asset",
  })
  assetId: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    type: String,
    format: "date-time",
    example: "2020-01-01T00:00:00Z",
    description: "Reading timestamp",
  })
  timestamp: Date;

  @IsNumber()
  @ApiProperty({
    type: "integer",
    example: 10000000,
    description: "Reading value in unit",
  })
  value: number;

  @IsEnum(Unit)
  @ApiProperty({ enum: Unit, enumName: "Unit" })
  unit: Unit;
}
