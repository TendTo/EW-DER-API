import { DynamicModule, Module } from "@nestjs/common";
import { InfluxdbService } from "./influxdb.service";

type InfluxdbModuleOptions = {
  global?: boolean;
  imports?: any[];
};

@Module({
  providers: [InfluxdbService],
  exports: [InfluxdbService],
})
export class InfluxdbModule {
  static forRoot(options?: InfluxdbModuleOptions): DynamicModule {
    const { global = false, imports = [] } = options ?? {};
    return {
      module: InfluxdbModule,
      providers: [InfluxdbService],
      exports: [InfluxdbService],
      global,
      imports,
    };
  }
}
