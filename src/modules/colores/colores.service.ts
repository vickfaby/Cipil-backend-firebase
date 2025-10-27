import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateColoreDto } from './dto/create-colores.dto';
import { UpdateColoreDto } from './dto/update-colores.dto';
import { Colores } from './entities/colores.entity';

@Injectable()
export class ColoresService {
  constructor(
    @InjectModel(Colores.name)
    private readonly coloresModel: ModelExt<Colores>,
  ) {}
  async create(createColoreDto: CreateColoreDto) {
    try {
      const color = await this.coloresModel.create(createColoreDto);
      return color;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    const colores = await this.coloresModel.find({}).select('-__v');
    return colores;
  }

  async findOne(id: string) {
    try {
      return await this.coloresModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateColoreDto: UpdateColoreDto) {
    const color = await this.findOne(id);
    try {
      if (!color) {
        throw new NotFoundException('Color no encontrado');
      }
      await color.updateOne(updateColoreDto);
      return { ...color.toJSON(), ...updateColoreDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.coloresModel.delete({ _id });
    return resp;
  }
  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Color exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Color - Check server logs`,
    );
  }
}
