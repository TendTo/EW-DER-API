import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { Unit } from "../../constants";

export class ReadingDTO {
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
    example: "2022-03-26T00:00:00Z",
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

  @IsOptional()
  @IsEnum(Unit)
  @ApiPropertyOptional({
    description: "Energy unit of value. Defaults to Wh",
    enum: Unit,
    enumName: "Unit",
    default: Unit.Wh,
  })
  unit: Unit = Unit.Wh;
}
