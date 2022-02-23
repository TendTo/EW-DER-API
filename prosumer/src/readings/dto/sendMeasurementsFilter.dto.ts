import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsPositive, Max } from "class-validator";
import { MAX_SEND_QUANTITY } from "../../constants";

export class SendMeasurementsFilterDTO {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({
    type: String,
    format: "date-time",
    example: "2020-01-01T00:00:00Z",
    description:
      "Only return measurements after this date. Defaults to the last sent measurement.",
  })
  startTimestamp: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({
    type: String,
    format: "date-time",
    example: "2020-01-01T00:00:00Z",
    description: "Only return measurements before this date",
  })
  endTimestamp: Date;

  @IsOptional()
  @IsNumber()
  @Max(MAX_SEND_QUANTITY)
  @IsPositive()
  @ApiPropertyOptional({
    type: "integer",
    default: 1,
    example: 1,
    description:
      "Minimum number of measurements to send. Fail if it finds less than this.",
  })
  minQuantity: number = 1;

  @IsOptional()
  @IsNumber()
  @Max(MAX_SEND_QUANTITY)
  @IsPositive()
  @ApiPropertyOptional({
    type: "integer",
    default: MAX_SEND_QUANTITY,
    example: 50,
    description: `Maximum number of measurements to send. Won't send more than this. Can't be greater than ${MAX_SEND_QUANTITY}.`,
  })
  maxQuantity: number = MAX_SEND_QUANTITY;
}
