import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { Status } from "../../constants";

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

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: "string",
    example: "09urv0un981evup2m8u3",
    description:
      "Precise proof calculated by the prosumer and to be confirmed by the validator, before being sent to the blockchain",
  })
  preciseProof?: string;

  @IsOptional()
  @IsEnum(Status)
  @ApiPropertyOptional({ enum: Status, enumName: "Status" })
  status?: Status;
}
