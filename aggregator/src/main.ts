import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as fs from "fs";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    ...(process.env.CERT_PATH &&
      process.env.KEY_PATH && {
        httpsOptions: {
          cert: fs.readFileSync(process.env.CERT_PATH),
          key: fs.readFileSync(process.env.KEY_PATH),
        },
      }),
  });

  const config = new DocumentBuilder()
    .setTitle("EW DER API (aggregator)")
    .setDescription("Sample API for EW DER readings management")
    .setVersion("1.0")
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "JWT")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  Logger.debug(`App on port: ${process.env.PORT ?? 3000}`);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
