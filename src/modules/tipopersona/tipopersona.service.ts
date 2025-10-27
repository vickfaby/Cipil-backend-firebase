import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateTipopersonaDto } from './dto/create-tipopersona.dto';
import { UpdateTipopersonaDto } from './dto/update-tipopersona.dto';
import { Tipopersona } from './entities/tipopersona.entity';

@Injectable()
export class TipopersonaService {
  constructor(
    @InjectModel(Tipopersona.name)
    private readonly tipopersonaModel: ModelExt<Tipopersona>,
  ) {}
  async create(createTipopersonaDto: CreateTipopersonaDto) {
    try {
      const tipopersonas = await this.tipopersonaModel.create(
        createTipopersonaDto,
      );
      return tipopersonas;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.tipopersonaModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.tipopersonaModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateTipopersonaDto: UpdateTipopersonaDto) {
    const tipopersona = await this.findOne(id);
    try {
      if (!tipopersona) {
        throw new BadRequestException('Tipo persona not found');
      }
      await tipopersona.updateOne(updateTipopersonaDto);
      return { ...tipopersona.toJSON(), ...updateTipopersonaDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.tipopersonaModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Tipo persona exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create tipo persona - Check server logs`,
    );
  }
}
