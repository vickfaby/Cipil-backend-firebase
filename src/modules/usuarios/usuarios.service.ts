import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateUsuariosDto } from './dto/create-usuarios.dto';
import { UpdateUsuariosDto } from './dto/update-usuarios.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Usuarios } from './entities/usuarios.entity';
import { HashingService } from 'src/common/providers/hashing/hashing.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuarios.name)
    private readonly usuariosModel: ModelExt<Usuarios>,
    private readonly hashingService: HashingService,
  ) {}
  async create(createUsuariosDto: CreateUsuariosDto) {
    try {
      createUsuariosDto.password = await this.hashingService.hash(
        createUsuariosDto.password.trim(),
      );
      const usuario = await this.usuariosModel.create(createUsuariosDto);
      return usuario;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.usuariosModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.usuariosModel
        .findById(id)
        .populate('tipodocumento')
        .populate('sexo')
        .populate('roles_id');
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async debugUsuario(id: string) {
    try {
      // Obtener el documento raw (con lean para ver todos los campos)
      const usuarioRaw = await this.usuariosModel.findById(id).lean().exec();

      // Obtener con populate
      const usuarioPopulated = await this.usuariosModel
        .findById(id)
        .populate('tipodocumento')
        .populate('sexo')
        .populate('roles_id')
        .lean()
        .exec();

      return {
        mensaje: 'Debug de usuario - todos los campos incluyendo null/undefined',
        usuario_raw: usuarioRaw,
        usuario_con_populate: usuarioPopulated,
        campos_importantes: {
          tiene_tipodocumento: usuarioRaw?.tipodocumento !== undefined,
          valor_tipodocumento: usuarioRaw?.tipodocumento || null,
          tiene_numerodocumento: usuarioRaw?.numerodocumento !== undefined,
          valor_numerodocumento: usuarioRaw?.numerodocumento || null,
          tiene_sexo: usuarioRaw?.sexo !== undefined,
          valor_sexo: usuarioRaw?.sexo || null,
        },
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findProfile(id: string) {
    try {
      return await this.usuariosModel
        .findById(id)
        .populate('tipodocumento')
        .populate('sexo')
        .populate('roles_id')
        .select('-password -token -__v');
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async find(correo: string) {
    let usuario: Usuarios | null = null;
    if (correo !== undefined) {
      usuario = await this.usuariosModel.findOne({ correo: correo });
      if (!usuario) {
        throw new NotFoundException(`Usuario with correo "${correo}" not found: ${correo}`);
      }
    }
    return usuario;
  }

  async update(id: string, updateUsuariosDto: UpdateUsuariosDto) {
    const usuario = await this.findOne(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario with id "${id}" not found`);
    }
    try {
      if (updateUsuariosDto.password !== undefined) {
        updateUsuariosDto.password = await this.hashingService.hash(
          updateUsuariosDto.password.trim(),
        );
      }

      await usuario?.updateOne(updateUsuariosDto);
      // Devolver el usuario actualizado con populates
      return await this.findOne(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    const usuario = await this.findOne(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario with id "${id}" not found`);
    }
    try {
      await usuario?.updateOne(updateProfileDto);
      return await this.findOne(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.usuariosModel.delete({ _id });
    return resp;
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
