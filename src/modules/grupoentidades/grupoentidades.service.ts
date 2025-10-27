import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateGrupoentidadeDto } from './dto/create-grupoentidade.dto';
import { UpdateGrupoentidadeDto } from './dto/update-grupoentidade.dto';
import { Grupoentidades } from './entities/grupoentidades.entity';

@Injectable()
export class GrupoentidadesService {
  constructor(
    @InjectModel(Grupoentidades.name)
    private readonly grupoentidadesModel: ModelExt<Grupoentidades>,
  ) {}
  async create(createGrupoentidadeDto: CreateGrupoentidadeDto) {
    try {
      const grupoentidades = await this.grupoentidadesModel.create(
        createGrupoentidadeDto,
      );
      return grupoentidades;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.grupoentidadesModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.grupoentidadesModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findByEntity(value: string) {
    try {
      return await this.grupoentidadesModel.find({
        entidad_id: value,
      });
      // .populate('entidad_id');
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateGrupoentidadeDto: UpdateGrupoentidadeDto) {
    const grupoentidades = await this.findOne(id);
    try {
      if (!grupoentidades) {
        throw new BadRequestException('Grupo entidades no encontrado');
      }
      await grupoentidades.updateOne(updateGrupoentidadeDto);
      return { ...grupoentidades.toJSON(), ...updateGrupoentidadeDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.grupoentidadesModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Grupo entidades exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Grupo entidades - Check server logs`,
    );
  }
}
