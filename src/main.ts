import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors() // enablecore for frontend integration
  
  app.useGlobalPipes(new ValidationPipe({
// automatically remove any properties from incoming requests that are not defined in the DTO
    whitelist: true,
// if any additional property is added which is not in DTO it Throws 400 error for unexpected properties
    forbidNonWhitelisted: true,
    transform: true,
  }))

  await app.listen(4001);

  console.log('Blog plateform api is ruuning on 4001 port')
}
bootstrap();
