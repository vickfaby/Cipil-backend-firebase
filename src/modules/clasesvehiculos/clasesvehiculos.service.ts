import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces'; 

import { CreateClasesvehiculoDto } from './dto/create-clasesvehiculo.dto';
import { UpdateClasesvehiculoDto } from './dto/update-clasesvehiculo.dto';
import { Clasesvehiculos } from './entities/clasesvehiculos.entity';

@Injectable()
export class ClasesvehiculosService {
  constructor(
    @InjectModel(Clasesvehiculos.name)
    private readonly clasesvehiculosModel: ModelExt<Clasesvehiculos>,
  ) {}
  async create(createClasesvehiculoDto: CreateClasesvehiculoDto) {
    try {
      const clasesvehiculos = await this.clasesvehiculosModel.create(
        createClasesvehiculoDto,
      );
      return clasesvehiculos;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.clasesvehiculosModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.clasesvehiculosModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateClasesvehiculoDto: UpdateClasesvehiculoDto) {
    const clasevehiculo = await this.findOne(id);
    try {
      if (!clasevehiculo) {
        throw new NotFoundException('Clase de vehículo no encontrada');
      }
      await clasevehiculo.updateOne(updateClasesvehiculoDto);
      return { ...clasevehiculo.toJSON(), ...updateClasesvehiculoDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.clasesvehiculosModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Clase vehiculos exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create clase vehiculos - Check server logs`,
    );
  }
}
