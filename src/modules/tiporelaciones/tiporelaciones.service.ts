import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateTiporelacionesDto } from './dto/create-tiporelaciones.dto';
import { UpdateTiporelacionesDto } from './dto/update-tiporelaciones.dto';
import { Tiporelaciones } from './entities/tiporelaciones.entity';

@Injectable()
export class TiporelacionesService {
  constructor(
    @InjectModel(Tiporelaciones.name)
    private readonly tiporelacionesModel: ModelExt<Tiporelaciones>,
  ) {}
  async create(createTiporelacionesDto: CreateTiporelacionesDto) {
    try {
      const usuario = await this.tiporelacionesModel.create(
        createTiporelacionesDto,
      );
      return usuario;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.tiporelacionesModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.tiporelacionesModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateTiporelacionesDto: UpdateTiporelacionesDto) {
    const tiporelaciones = await this.findOne(id);
    try {
      if (!tiporelaciones) {
        throw new BadRequestException('Tipo relaciones not found');
      }
      await tiporelaciones.updateOne(updateTiporelacionesDto);
      return { ...tiporelaciones.toJSON(), ...updateTiporelacionesDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.tiporelacionesModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Tipo relaciones exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create tipo relaciones - Check server logs`,
    );
  }
}
