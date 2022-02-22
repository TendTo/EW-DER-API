import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, ValidateNested } from "class-validator";
import { ReadingDTO } from ".";
import { Unit } from "../constants";

export class MeasurementsDTO {
  @ValidateNested()
  @Type(() => ReadingDTO)
  @ApiProperty({ type: () => [ReadingDTO] })
  readings: ReadingDTO[];

  @IsEnum(Unit)
  @ApiProperty({ enum: Unit, enumName: "Unit" })
  unit: Unit;
}
