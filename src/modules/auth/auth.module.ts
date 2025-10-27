import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import {
  Usuarios,
  UsuariosSchema,
} from 'src/modules/usuarios/entities/usuarios.entity';
import { HashingService } from 'src/common/providers/hashing/hashing.service';
import { BcryptService } from 'src/common/providers/hashing/bcrypt.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          signOptions: { expiresIn: '7d' },
          secret: process.env.JWT_SECRET,
        };
      },
    }),

    MongooseModule.forFeature([
      {
        name: Usuarios.name,
        schema: UsuariosSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    AuthService,
  ],
})
export class AuthModule {}
