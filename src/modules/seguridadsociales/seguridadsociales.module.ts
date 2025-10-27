import { Module } from '@nestjs/common';
import { SeguridadsocialesService } from './seguridadsociales.service';
import { SeguridadsocialesController } from './seguridadsociales.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Seguridadsociales,
  SeguridadsocialesSchema,
} from './entities/seguridadsociales.entity';

@Module({
  controllers: [SeguridadsocialesController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Seguridadsociales.name,
        schema: SeguridadsocialesSchema,
      },
    ]),
  ],
  providers: [SeguridadsocialesService],
  exports: [SeguridadsocialesService],
})
export class SeguridadsocialesModule {}
