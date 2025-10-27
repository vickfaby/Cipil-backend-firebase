import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateTipodocumentosDto } from './dto/create-tipodocumentos.dto';
import { UpdateTipodocumentosDto } from './dto/update-tipodocumentos.dto';
import { Tipodocumentos } from './entities/tipodocumentos.entity';

@Injectable()
export class TipodocumentosService {
  constructor(
    @InjectModel(Tipodocumentos.name)
    private readonly tipodocumentosModel: ModelExt<Tipodocumentos>,
  ) {}
  async create(createTipodocumentoDto: CreateTipodocumentosDto) {
    try {
      const tipodocumentos = await this.tipodocumentosModel.create(
        createTipodocumentoDto,
      );
      return tipodocumentos;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.tipodocumentosModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.tipodocumentosModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateTipodocumentoDto: UpdateTipodocumentosDto) {
    const tipodocumentos = await this.findOne(id);
    try {
      if (!tipodocumentos) {
        throw new BadRequestException('Tipo documento not found');
      }
      await tipodocumentos.updateOne(updateTipodocumentoDto);
      return { ...tipodocumentos.toJSON(), ...updateTipodocumentoDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.tipodocumentosModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Tipo documento exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create tipo documento - Check server logs`,
    );
  }
}
