import { IntersectionType } from "@nestjs/swagger";
import { LimitFilterDTO, RangeFilterDTO } from "src/utility";

export class AssetsFilterDTO extends IntersectionType(RangeFilterDTO, LimitFilterDTO) {}
