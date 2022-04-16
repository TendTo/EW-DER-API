import type { DynamicModule } from "@nestjs/common";

type DynamicModuleOptions = {
  global?: boolean;
  imports?: any[];
  exports?: any[];
  providers?: any[];
};

export class ConfigurableModule {
  protected static defaultProviders = [];
  protected static defaultExports = [];
  protected static defaultImports = [];

  static forRoot(options?: DynamicModuleOptions): DynamicModule {
    const {
      global = false,
      imports = this.defaultImports,
      exports = this.defaultExports,
      providers = this.defaultProviders,
    } = options ?? {};
    return {
      module: this,
      providers,
      exports,
      global,
      imports,
    };
  }
}
