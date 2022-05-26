import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";
import { BaseReadingFilter } from "./baseReadingFilter.dto";

export class ReadingsFilterDTO extends BaseReadingFilter {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiProperty({
    type: Boolean,
    description:
      'When "true" it will calculate the difference between reads before applying aggregation functions',
    default: false,
  })
  difference: boolean = false;
}
