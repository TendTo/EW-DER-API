import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsString } from "class-validator";
import { Status } from "../../constants";
import { ReadingDTO } from "./reading.dto";

export class AggregatedReadingsDTO {
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    type: String,
    format: "date-time",
    example: "2022-03-26T00:00:00Z",
    description: "Readings window start timestamp",
  })
  start: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    type: String,
    format: "date-time",
    example: "2022-03-27T00:00:00Z",
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

  @IsArray({ each: true })
  @Type(() => String)
  @ApiProperty({
    description: "Salts that have been used to generate the Merkle tree",
    type: [String],
  })
  salts: string[];

  @IsEnum(Status)
  @ApiProperty({ enum: Status, enumName: "Status" })
  status: Status;

  @IsArray()
  @Type(() => ReadingDTO)
  @ApiProperty({
    description: "List of readings that have been aggregated",
    type: [ReadingDTO],
  })
  readings: ReadingDTO[];

  @IsString()
  @ApiProperty({
    type: String,
    description: "Signature of the rootHash",
  })
  signature: string;
}
