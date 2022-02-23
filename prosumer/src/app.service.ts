import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  ping(): boolean {
    return true;
  }
}
