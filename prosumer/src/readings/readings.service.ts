import { Injectable } from "@nestjs/common";
import { Status } from "src/constants";
import { MeasurementDTO } from "./dto";
import { Measurement } from "./entities";

@Injectable()
export class ReadingsService {
  create({ timestamp, value, unit }: MeasurementDTO) {
    const newMeasurement = new Measurement(timestamp, value, unit);
    return newMeasurement.save();
  }

  findAll() {
    return Measurement.find();
  }

  findOne(id: number) {
    return Measurement.find({ id });
  }

  updateStatus(id: number, status: Status) {
    return Measurement.update({ id }, { status });
  }

  remove(id: number) {
    return Measurement.delete({ id });
  }
}
