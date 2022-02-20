import { Injectable } from "@nestjs/common";
import { CreateReadingDto } from "./dto/create-reading.dto";
import { UpdateReadingDto } from "./dto/update-reading.dto";

@Injectable()
export class ReadingsService {
  create(createReadingDto: CreateReadingDto) {
    return "This action adds a new reading";
  }

  findAll() {
    return `This action returns all readings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reading`;
  }

  update(id: number, updateReadingDto: UpdateReadingDto) {
    return `This action updates a #${id} reading`;
  }

  remove(id: number) {
    return `This action removes a #${id} reading`;
  }
}
