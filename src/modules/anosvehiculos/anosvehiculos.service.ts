import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateAnosvehiculoDto } from './dto/create-anosvehiculo.dto';
import { UpdateAnosvehiculoDto } from './dto/update-anosvehiculo.dto';
import { Anosvehiculos } from './entities/anosvehiculos.entity';

@Injectable()
export class AnosvehiculosService {
  constructor(
    @InjectModel(Anosvehiculos.name)
    private readonly AnosvehiculoModel: Model<Anosvehiculos>,
  ) {}
  async create(createAnosvehiculoDto: CreateAnosvehiculoDto) {
    try {
      const anovehiculo = await this.AnosvehiculoModel.create(
        createAnosvehiculoDto,
      );
      return anovehiculo;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return await this.AnosvehiculoModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.AnosvehiculoModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findByBrand(value: string) {
    try {
      return await this.AnosvehiculoModel.find({
        marcavehiculo_id: value,
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateAnosvehiculoDto: UpdateAnosvehiculoDto) {
    const anovehiculo = await this.findOne(id);
    try {
      if (!anovehiculo) {
        throw new NotFoundException('Año vehiculo not found: ' + id);
      }
      await anovehiculo.updateOne(updateAnosvehiculoDto);
      return await this.findOne(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = await this.AnosvehiculoModel.findByIdAndDelete(_id);
    if (!resp) {
      throw new NotFoundException('Año vehiculo not found: ' + _id);
    }
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Año vehiculo exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Año vehiculo - Check server logs`,
    );
  }
}
