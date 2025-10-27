import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateTipovehiculosDto } from './dto/create-tipovehiculos.dto';
import { UpdateTipovehiculosDto } from './dto/update-tipovehiculos.dto';
import { Tipovehiculos } from './entities/tipovehiculos.entity';

@Injectable()
export class TipovehiculosService {
  constructor(
    @InjectModel(Tipovehiculos.name)
    private readonly tipovehiculoModel: ModelExt<Tipovehiculos>,
  ) {}
  async create(createTipovehiculoDto: CreateTipovehiculosDto) {
    try {
      const usuario = await this.tipovehiculoModel.create(
        createTipovehiculoDto,
      );
      return usuario;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.tipovehiculoModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.tipovehiculoModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateTipovehiculoDto: UpdateTipovehiculosDto) {
    const tipovehiculo = await this.findOne(id);
    if (!tipovehiculo) {
      throw new NotFoundException(`Tipo vehiculo with id "${id}" not found`);
    }
    try {
      await tipovehiculo?.updateOne(updateTipovehiculoDto);
      return { ...tipovehiculo.toJSON(), ...updateTipovehiculoDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const tipovehiculo = await this.findOne(id);
    if (!tipovehiculo) {
      throw new NotFoundException(`Tipo vehiculo with id "${id}" not found`);
    }
    try {
      await tipovehiculo?.deleteOne();
      return { message: 'Tipo vehiculo deleted successfully' };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Tipo vehiculo exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Tipo vehiculo - Check server logs`,
    );
  }
}
