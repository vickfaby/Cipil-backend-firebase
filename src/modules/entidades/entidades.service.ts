import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateEntidadesDto } from './dto/create-entidades.dto';
import { UpdateEntidadesDto } from './dto/update-entidades.dto';
import { Entidades } from './entities/entidades.entity';

@Injectable()
export class EntidadesService {
  constructor(
    @InjectModel(Entidades.name)
    private readonly entidadesModel: ModelExt<Entidades>,
  ) {}
  async create(createEntidadeDto: CreateEntidadesDto) {
    try {
      const entidad = await this.entidadesModel.create(createEntidadeDto);
      return entidad;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.entidadesModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.entidadesModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateEntidadeDto: UpdateEntidadesDto) {
    const entidad = await this.findOne(id);
    try {
      if (!entidad) {
        throw new BadRequestException('Entidad no encontrada');
      }
      await entidad.updateOne(updateEntidadeDto);
      return { ...entidad.toJSON(), ...updateEntidadeDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.entidadesModel.delete({ _id });
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
