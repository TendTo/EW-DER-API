import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import fs from "fs";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    httpsOptions: {
      ...(process.env.CA_PATH && { ca: fs.readFileSync(process.env.CA_PATH) }),
      ...(process.env.KEY_PATH && { key: fs.readFileSync(process.env.KEY_PATH) }),
    },
  });

  const config = new DocumentBuilder()
    .setTitle("EW DER API (aggregator)")
    .setDescription("Sample API for EW DER readings management")
    .setVersion("1.0")
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "JWT")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
