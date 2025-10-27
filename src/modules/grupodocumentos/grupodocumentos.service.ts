import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateGrupodocumentoDto } from './dto/create-grupodocumento.dto';
import { UpdateGrupodocumentoDto } from './dto/update-grupodocumento.dto';
import { Grupodocumentos } from './entities/grupodocumentos.entity';

@Injectable()
export class GrupodocumentosService {
  constructor(
    @InjectModel(Grupodocumentos.name)
    private readonly grupodocumentosModel: ModelExt<Grupodocumentos>,
  ) {}

  async create(createGrupodocumentoDto: CreateGrupodocumentoDto) {
    try {
      const grupodocumento = await this.grupodocumentosModel.create(
        createGrupodocumentoDto,
      );
      return grupodocumento;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.grupodocumentosModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.grupodocumentosModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateGrupodocumentoDto: UpdateGrupodocumentoDto) {
    const grupodocumento = await this.findOne(id);
    try {
      if (!grupodocumento) {
        throw new BadRequestException('Grupo documento no encontrado');
      }
      await grupodocumento.updateOne(updateGrupodocumentoDto);
      return { ...grupodocumento.toJSON(), ...updateGrupodocumentoDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.grupodocumentosModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `grupo documento exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create grupo documento - Check server logs`,
    );
  }
}
