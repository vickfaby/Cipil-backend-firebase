import { Module } from '@nestjs/common';
import { StatesService } from './states.service';
import { StatesController } from './states.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { State, StateSchema } from './entities/state.entity';

@Module({
  controllers: [StatesController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: State.name,
        schema: StateSchema,
      },
    ]),
  ],
  providers: [StatesService],
  exports: [StatesService],
})
export class StatesModule {}
