import { Unit } from "../constants";
import { IsEnum, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { ReadingDTO } from "./";

export class MeasurementDTO {
  @ValidateNested()
  @Type(() => ReadingDTO)
  @ApiProperty({ type: () => [ReadingDTO] })
  readings: ReadingDTO[];

  @IsEnum(Unit)
  @ApiProperty({ enum: Unit, enumName: "Unit" })
  unit: Unit;
}
