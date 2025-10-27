import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateSexoDto } from './dto/create-sexo.dto';
import { UpdateSexoDto } from './dto/update-sexo.dto';
import { Sexo } from './entities/sexo.entity';

@Injectable()
export class SexoService {
  constructor(
    @InjectModel(Sexo.name)
    private readonly sexoModel: ModelExt<Sexo>,
  ) {}
  async create(createSexoDto: CreateSexoDto) {
    try {
      const sexo = await this.sexoModel.create(createSexoDto);
      return sexo;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.sexoModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.sexoModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateSexoDto: UpdateSexoDto) {
    const sexo = await this.findOne(id);
    try {
      if (!sexo) {
        throw new BadRequestException('Sexo not found');
      }
      await sexo.updateOne(updateSexoDto);
      return { ...sexo.toJSON(), ...updateSexoDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.sexoModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Sexo exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create sexo - Check server logs`,
    );
  }
}
