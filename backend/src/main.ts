import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {BadRequestException, ValidationPipe} from "@nestjs/common";
import {useContainer} from "class-validator";
import * as moment from "moment-timezone";

async function bootstrap() {
  const port = process.env.PORT
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (errors) => {
          const errorMessages = {};
          errors.forEach(error => {
            if (error.constraints) {
              errorMessages[error.property]= Object.values(error.constraints);
            } else {
              error.children.forEach(child => {
                errorMessages[child.property] = child.constraints
              })
            }
          })
          return new BadRequestException(errorMessages);
        }
      })
  );

  const config = new DocumentBuilder()
      .setTitle('aCode CRM')
      .setDescription('aCode CRM API')
      .setVersion('1.0')
      .addTag('acode')
      .addBearerAuth()
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(port).then(() => {
    // console.log(+new Date())

    const date = moment.utc()
    console.log(`Server is running at port ${port} at ${date}`)
  });
}

bootstrap();
