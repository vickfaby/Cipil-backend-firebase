import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateMarcasvehiculoDto } from './dto/create-marcasvehiculo.dto';
import { UpdateMarcasvehiculoDto } from './dto/update-marcasvehiculo.dto';
import { Marcasvehiculos } from './entities/marcasvehiculos.entity';

@Injectable()
export class MarcasvehiculosService {
  constructor(
    @InjectModel(Marcasvehiculos.name)
    private readonly marcasvehiculosModel: ModelExt<Marcasvehiculos>,
  ) {}
  async create(createMarcasvehiculoDto: CreateMarcasvehiculoDto) {
    try {
      const marcasvehiculos = await this.marcasvehiculosModel.create(
        createMarcasvehiculoDto,
      );
      return marcasvehiculos;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.marcasvehiculosModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.marcasvehiculosModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateMarcasvehiculoDto: UpdateMarcasvehiculoDto) {
    const marcasvehiculo = await this.findOne(id);
    try {
      if (!marcasvehiculo) {
        throw new NotFoundException('Marca de vehículo no encontrada');
      }
      await marcasvehiculo.updateOne(updateMarcasvehiculoDto);
      return { ...marcasvehiculo.toJSON(), ...updateMarcasvehiculoDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.marcasvehiculosModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `marcas vehiculos exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create marcas vehiculos - Check server logs`,
    );
  }
}
