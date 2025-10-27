import { Module } from '@nestjs/common';
import { EmpresagpsService } from './empresagps.service';
import { EmpresagpsController } from './empresagps.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Empresagps, EmpresagpsSchema } from './entities/empresagps.entity';

@Module({
  controllers: [EmpresagpsController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Empresagps.name,
        schema: EmpresagpsSchema,
      },
    ]),
  ],
  providers: [EmpresagpsService],
  exports: [EmpresagpsService],
})
export class EmpresagpsModule {}
