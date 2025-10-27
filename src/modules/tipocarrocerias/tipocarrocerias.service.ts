import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateTipocarroceriaDto } from './dto/create-tipocarroceria.dto';
import { UpdateTipocarroceriaDto } from './dto/update-tipocarroceria.dto';
import { Tipocarrocerias } from './entities/tipocarrocerias.entity';

@Injectable()
export class TipocarroceriasService {
  constructor(
    @InjectModel(Tipocarrocerias.name)
    private readonly tipocarroceriasModel: ModelExt<Tipocarrocerias>,
  ) {}
  async create(createTipocarroceriaDto: CreateTipocarroceriaDto) {
    try {
      const tipocarrocerias = await this.tipocarroceriasModel.create(
        createTipocarroceriaDto,
      );
      return tipocarrocerias;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.tipocarroceriasModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.tipocarroceriasModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateTipocarroceriaDto: UpdateTipocarroceriaDto) {
    const tipocarrocerias = await this.findOne(id);
    try {
      if (!tipocarrocerias) {
        throw new BadRequestException('Tipo de carrocería no encontrada');
      }
      await tipocarrocerias.updateOne(updateTipocarroceriaDto);
      return { ...tipocarrocerias.toJSON(), ...updateTipocarroceriaDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.tipocarroceriasModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Tipo carroceria exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create tipo carroceria - Check server logs`,
    );
  }
}
