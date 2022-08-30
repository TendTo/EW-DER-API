import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle("EW DER API (prosumer)")
    .setDescription("Sample API for EW DER readings management from the prosumer")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  Logger.debug(`App on port: ${process.env.PORT ?? 3000}`);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
