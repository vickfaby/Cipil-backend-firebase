import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateMarcaenganchesDto } from './dto/create-marcaenganches.dto';
import { UpdateMarcaenganchesDto } from './dto/update-marcaenganches.dto';
import { Marcaenganches } from './entities/marcaenganches.entity';

@Injectable()
export class MarcaenganchesService {
  constructor(
    @InjectModel(Marcaenganches.name)
    private readonly marcaenganchesModel: ModelExt<Marcaenganches>,
  ) {}
  async create(createMarcaenganchesDto: CreateMarcaenganchesDto) {
    try {
      const marcaenganche = await this.marcaenganchesModel.create(
        createMarcaenganchesDto,
      );
      return marcaenganche;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return await this.marcaenganchesModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.marcaenganchesModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateMarcaenganchesDto: UpdateMarcaenganchesDto) {
    const marcaenganche = await this.findOne(id);
    try {
      if (!marcaenganche) {
        throw new BadRequestException('Marca enganche no encontrada');
      }
      await marcaenganche.updateOne(updateMarcaenganchesDto);
      return { ...marcaenganche.toJSON(), ...updateMarcaenganchesDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.marcaenganchesModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `marca enganche exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create marca enganche - Check server logs`,
    );
  }
}
