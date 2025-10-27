import { Module } from '@nestjs/common';
import { PlacaenganchesService } from './placaenganches.service';
import { PlacaenganchesController } from './placaenganches.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Placaenganches,
  PlacaenganchesSchema,
} from './entities/placaenganches.entity';

@Module({
  controllers: [PlacaenganchesController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Placaenganches.name,
        schema: PlacaenganchesSchema,
      },
    ]),
  ],
  providers: [PlacaenganchesService],
  exports: [PlacaenganchesService],
})
export class PlacaenganchesModule {}
