import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('CriticLib API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
