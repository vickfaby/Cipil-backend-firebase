import { Module } from '@nestjs/common';
import { MarcaenganchesService } from './marcaenganches.service';
import { MarcaenganchesController } from './marcaenganches.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Marcaenganches,
  MarcaenganchesSchema,
} from './entities/marcaenganches.entity';

@Module({
  controllers: [MarcaenganchesController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Marcaenganches.name,
        schema: MarcaenganchesSchema,
      },
    ]),
  ],
  providers: [MarcaenganchesService],
})
export class MarcaenganchesModule {}
