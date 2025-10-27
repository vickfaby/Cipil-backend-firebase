import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateTipoterceroDto } from './dto/create-tipotercero.dto';
import { UpdateTipoterceroDto } from './dto/update-tipotercero.dto';
import { Tipoterceros } from './entities/tipoterceros.entity';

@Injectable()
export class TipotercerosService {
  constructor(
    @InjectModel(Tipoterceros.name)
    private readonly tipotercerosModel: ModelExt<Tipoterceros>,
  ) {}
  async create(createTipoterceroDto: CreateTipoterceroDto) {
    try {
      const usuario = await this.tipotercerosModel.create(createTipoterceroDto);
      return usuario;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.tipotercerosModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.tipotercerosModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateTipoterceroDto: UpdateTipoterceroDto) {
    const tipotercero = await this.findOne(id);
    try {
      if (!tipotercero) {
        throw new BadRequestException('Tipo tercero not found');
      }
      await tipotercero.updateOne(updateTipoterceroDto);
      return { ...tipotercero.toJSON(), ...updateTipoterceroDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.tipotercerosModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Tipo terceros exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create tipo terceros - Check server logs`,
    );
  }
}
