import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from  '@nestjs/jwt';

import { ActiveAuthDto } from './dto/active-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { Usuarios } from '../usuarios/entities/usuarios.entity';
import { HashingService } from 'src/common/providers/hashing/hashing.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChangePasswordAuthDto } from './dto/change-pass-auth.dto';
//import { CheckAuthDto } from './dto/check-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuarios.name)
    private readonly usuariosModel: Model<Usuarios>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  public async register(registerDto: RegisterAuthDto) {
    const activecode = process.env.JWT_ACTIVE;
    const { correo } = registerDto;

    try {
      registerDto.password = await this.hashingService.hash(
        registerDto.password.trim(),
      );
      registerDto.token = await this.jwtService.sign(
        { correo },
        {
          secret: activecode,
          expiresIn: '30m',
        },
      );
      const register = await this.usuariosModel.create(registerDto);
      this.eventEmitter.emit('usuario.register', register);

      return register;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  public async login(loginDto: LoginAuthDto) {
    const usersExist = await this.usuariosModel
      .findOne({
        correo: loginDto.correo,
      })
      .populate('roles_id');
    if (!usersExist)
      throw new BadRequestException(`Usuario no existe en la base de datos`);

    const isCheck = await this.hashingService.compare(
      loginDto.password,
      usersExist.password,
    );

    if (!isCheck)
      throw new UnauthorizedException('contraseña incorrecta, intente denuevo');

    const isActive = await this.usuariosModel.findOne({
      correo: loginDto.correo,
      estado: true,
    });

    if (!isActive)
      throw new ConflictException('Usuario no activado, verifique su email');

    const payload = {
      id: usersExist._id,
    };

    const token = this.jwtService.sign(payload);

    const data = {
      token,
      user: usersExist,
    };

    return data;
  }
  public async loginFirebase(email: string) {
    const usersExist = await this.usuariosModel
    .findOne({
      correo: email,
    })
    .populate('roles_id');
  if (!usersExist)
    throw new BadRequestException(`Usuario no existe en la base de datos`);


  const isActive = await this.usuariosModel.findOne({
    correo: email,
    estado: true,
  });

  if (!isActive){
    await this.usuariosModel.updateOne({ correo: email }, { estado: true });
    usersExist.estado = true;
  }
    

  const payload = {
    id: usersExist._id,
  };

  const data = {
    user: usersExist,
  };

  return data;
  }

  // public async checkAuthStatus(checkAuthDto: CheckAuthDto) {
  //   const user =  await this.usuariosModel.findById(checkAuthDto._id);

  //   if (!user || !user.token)
  //     throw new BadRequestException('Acceso denegado');

  //   return {
  //     token:
  //   }
  // }

  public async active(activeDto: ActiveAuthDto) {
    //console.log(activeDto);
    const activecode = process.env.JWT_ACTIVE;

    const payload = await this.jwtService.verify(activeDto.token, {
      secret: activecode,
    });

    if (!payload)
      throw new BadRequestException('Email confirmation token expired');

    const usersExist = await this.usuariosModel.findOne({
      correo: payload.correo,
    });

    if (!usersExist)
      throw new BadRequestException(
        `Cuenta no existe, verifique los datos en intente nuevamente`,
      );

    if (usersExist && usersExist.estado === true)
      throw new BadRequestException(
        `Cuenta Activada, porfavor revise su email`,
      );

    const data = {
      estado: true,
      token: '',
    };

    try {
      await usersExist.updateOne(data);
      this.eventEmitter.emit('usuario.actived', usersExist);
    } catch (error) {
      console.log('🚀 ~  error:', error);
    }
  }

  // forgot password

  //change password
  public async resetpass(changePasswordAuthDto: ChangePasswordAuthDto) {
    const usersExist = await this.usuariosModel.findOne({
      correo: changePasswordAuthDto.correo,
    });
    if (!usersExist)
      throw new BadRequestException(
        `Cuenta no existe, verifique los datos en intente nuevamente`,
      );
    try {
      const newpass = await this.hashingService.hash(
        changePasswordAuthDto.newPassword.trim(),
      );
      // const filter = { _id: usersExist._id };

      const update = {
        password: newpass,
      };

      this.usuariosModel
        .findByIdAndUpdate(
          usersExist._id,
          { $set: update },
          { new: true, runValidators: true },
        )
        .exec();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Usuario exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Usuario - Check server logs`,
    );
  }
}
