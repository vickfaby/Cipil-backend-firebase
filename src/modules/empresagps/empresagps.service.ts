import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateEmpresagpDto } from './dto/create-empresagp.dto';
import { UpdateEmpresagpDto } from './dto/update-empresagp.dto';
import { Empresagps } from './entities/empresagps.entity';

@Injectable()
export class EmpresagpsService {
  constructor(
    @InjectModel(Empresagps.name)
    private readonly empresagpsModel: ModelExt<Empresagps>,
  ) {}
  async create(createEmpresagpDto: CreateEmpresagpDto) {
    try {
      const empresagps = await this.empresagpsModel.create(createEmpresagpDto);
      return empresagps;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.empresagpsModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.empresagpsModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateEmpresagpDto: UpdateEmpresagpDto) {
    const empresagps = await this.findOne(id);
    try {
      if (!empresagps) {
        throw new BadRequestException('Empresa gps no encontrada');
      }
      await empresagps.updateOne(updateEmpresagpDto);
      return { ...empresagps.toJSON(), ...updateEmpresagpDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.empresagpsModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Empresa gps exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Empresa gps - Check server logs`,
    );
  }
}
