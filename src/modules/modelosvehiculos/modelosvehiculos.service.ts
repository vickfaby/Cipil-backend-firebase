import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateModelosvehiculoDto } from './dto/create-modelosvehiculo.dto';
import { UpdateModelosvehiculoDto } from './dto/update-modelosvehiculo.dto';
import { Modelosvehiculos } from './entities/modelosvehiculos.entity';
import { FindModelovehiculoDto } from './dto/find-modelovehiculo.dto';

@Injectable()
export class ModelosvehiculosService {
  constructor(
    @InjectModel(Modelosvehiculos.name)
    private readonly modelosvehiculoModel: ModelExt<Modelosvehiculos>,
  ) {}
  async create(createModelosvehiculoDto: CreateModelosvehiculoDto) {
    try {
      const modelosvehiculo = await this.modelosvehiculoModel.create(
        createModelosvehiculoDto,
      );
      return modelosvehiculo;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.modelosvehiculoModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.modelosvehiculoModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByYearAndBrand(findModelovehiculoDto: FindModelovehiculoDto) {
    try {
      return await this.modelosvehiculoModel.find({
        marca_vehiculo_id: findModelovehiculoDto.marca_vehiculo_id,
        marca_vehiculo_ano_id: findModelovehiculoDto.marca_vehiculo_ano_id,
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateModelosvehiculoDto: UpdateModelosvehiculoDto) {
    const updateModelo = await this.findOne(id);
    try {
      if (!updateModelo) {
        throw new BadRequestException('Modelo de vehículo no encontrado');
      }
      await updateModelo.updateOne(updateModelosvehiculoDto);
      return { ...updateModelo.toJSON(), ...updateModelosvehiculoDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.modelosvehiculoModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `modelos vehiculo exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create modelos vehiculo - Check server logs`,
    );
  }
}
