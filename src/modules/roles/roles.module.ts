import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Roles, RolesSchema } from './entities/role.entity';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Roles.name,
        schema: RolesSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class RolesModule {}
