import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, Validate } from "class-validator";
import { IsBeforeConstraint } from "../validators";

export class RangeFilterDTO {
  @IsDateString()
  @Validate(IsBeforeConstraint, ["stop"])
  @ApiProperty({ format: "date-time", example: "2020-01-01T00:00:00Z" })
  start: string;

  @IsDateString()
  @ApiProperty({ format: "date-time", example: "2020-01-02T00:00:00Z" })
  stop: string;
}
