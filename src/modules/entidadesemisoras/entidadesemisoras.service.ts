import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateEntidadesemisorasDto } from './dto/create-entidadesemisora.dto';
import { UpdateEntidadesemisorasDto } from './dto/update-entidadesemisora.dto';
import { Entidadesemisoras } from './entities/entidadesemisoras.entity';

@Injectable()
export class EntidadesemisorasService {
  constructor(
    @InjectModel(Entidadesemisoras.name)
    private readonly entidadesEmisorasModel: ModelExt<Entidadesemisoras>,
  ) {}
  async create(createEntidadesemisorasDto: CreateEntidadesemisorasDto) {
    try {
      const entidadEmisora = await this.entidadesEmisorasModel.create(
        createEntidadesemisorasDto,
      );
      return entidadEmisora;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.entidadesEmisorasModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.entidadesEmisorasModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(
    id: string,
    updateEntidadesemisorasDto: UpdateEntidadesemisorasDto,
  ) {
    const entidademisora = await this.findOne(id);
    try {
      if (!entidademisora) {
        throw new BadRequestException('Entidad emisora no encontrada');
      }
      await entidademisora.updateOne(updateEntidadesemisorasDto);
      return { ...entidademisora.toJSON(), ...updateEntidadesemisorasDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.entidadesEmisorasModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Entidad emisora exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Entidad emisora - Check server logs`,
    );
  }
}
