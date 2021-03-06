import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Status } from "src/constants";
import { ReducedReadingDTO } from "./reducedReading.dto";

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
    type: String,
    example: "0x6a2d994fb3bfbb568f940a7fd3a2f43555858a001fb5f2783cc76335431b93c1",
    description:
      "Root hash calculated by the prosumer and to be confirmed by the validator, before being sent to the blockchain",
  })
  rootHash: string;

  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @ApiProperty({
    description: "Salts that have been used to generate the Merkle tree",
    type: [String],
  })
  salts: string[];

  @IsArray()
  @ArrayMinSize(parseInt(process.env.AGGREGATION_THRESHOLD ?? "30"))
  @ValidateNested({ each: true })
  @Type(() => ReducedReadingDTO)
  @ApiProperty({
    description: "List of readings that have been aggregated",
    type: [ReducedReadingDTO],
  })
  readings: ReducedReadingDTO[];

  @IsOptional()
  @IsEnum(Status)
  @ApiPropertyOptional({ enum: Status, enumName: "Status" })
  status: Status = Status.Accepted;

  @IsString()
  @ApiProperty({
    type: String,
    description: "Signature of the rootHash",
  })
  signature: string;

  public toString() {
    return `AggregatedReadingsDTO {
      start: ${this.start},
      stop: ${this.stop},
      rootHash: ${this.rootHash},
      salts: ${this.salts},
      readings: ${this.readings},
      status: ${this.status},
      signature: ${this.signature}
    }`;
  }
}
