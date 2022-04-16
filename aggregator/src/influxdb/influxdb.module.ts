import { Module } from "@nestjs/common";
import { ConfigurableModule } from "src/utility";
import { InfluxdbService } from "./influxdb.service";

@Module({
  providers: [InfluxdbService],
  exports: [InfluxdbService],
})
export class InfluxdbModule extends ConfigurableModule {
  protected static defaultExports = [InfluxdbService];
  protected static defaultProviders = [InfluxdbService];
}
