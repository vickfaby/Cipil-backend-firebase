import { Module } from '@nestjs/common';
import { LogimpresionesService } from './logimpresiones.service';
import { LogimpresionesController } from './logimpresiones.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Logimpresiones,
  LogimpresionesSchema,
} from './entities/logimpresiones.entity';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Logimpresiones.name,
        schema: LogimpresionesSchema,
      },
    ]),
  ],
  controllers: [LogimpresionesController],
  providers: [LogimpresionesService],
  exports: [LogimpresionesService],
})
export class LogimpresionesModule {}
