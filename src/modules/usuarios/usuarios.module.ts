import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuarios, UsuariosSchema } from './entities/usuarios.entity';
import { HashingService } from 'src/common/providers/hashing/hashing.service';
import { BcryptService } from 'src/common/providers/hashing/bcrypt.service';

@Module({
  controllers: [UsuariosController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Usuarios.name,
        schema: UsuariosSchema,
      },
    ]),
  ],
  providers: [
    UsuariosService,
    { provide: HashingService, useClass: BcryptService },
  ],
  exports: [UsuariosService],
})
export class UsuariosModule {}
