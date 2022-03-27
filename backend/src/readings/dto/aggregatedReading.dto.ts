import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { Status } from "../../constants";
import { ReadingDTO } from "./reading.dto";

export class AggregatedReadingsDTO {
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

  @IsString()
  @ApiProperty({
    type: "string",
    example: "09urv0un981evup2m8u3",
    description:
      "Root hash calculated by the prosumer and to be confirmed by the validator, before being sent to the blockchain",
  })
  rootHash: string;

  @IsArray()
  @Type(() => String)
  @ApiProperty({
    description: "Salts that have been used to generate the Merkle tree",
    type: [String],
  })
  salts: string[];

  @IsArray()
  @Type(() => ReadingDTO)
  @ApiProperty({
    description: "List of readings that have been aggregated",
    type: [ReadingDTO],
  })
  readings: ReadingDTO[];

  @IsOptional()
  @IsEnum(Status)
  @ApiPropertyOptional({ enum: Status, enumName: "Status" })
  status: Status = Status.Accepted;
}
