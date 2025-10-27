import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreatePlacaenganchesDto } from './dto/create-placaenganches.dto';
import { UpdatePlacaenganchesDto } from './dto/update-placaenganches.dto';
import { Placaenganches } from './entities/placaenganches.entity';

@Injectable()
export class PlacaenganchesService {
  constructor(
    @InjectModel(Placaenganches.name)
    private readonly placaenganchesModel: ModelExt<Placaenganches>,
  ) {}

  async create(createPlacaenganchesDto: CreatePlacaenganchesDto) {
    //console.log(createPlacaenganchesDto);
    try {
      const placaenganche = await this.placaenganchesModel.create(
        createPlacaenganchesDto,
      );
      return placaenganche;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.placaenganchesModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.placaenganchesModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByPlaca(placa: string) {
    try {
      return await this.placaenganchesModel.find({ placa: placa });
      // .populate([
      //   {
      //     path: 'marca_id',
      //     select: 'marcaEnganche -_id',
      //   },
      // ])
      // .populate([
      //   {
      //     path: 'color_id',
      //     select: 'nombre_color -_id',
      //   },
      // ])
      // .populate([
      //   {
      //     path: 'tipocarroceria_id',
      //     select: 'nombre_tipocarroceria -_id',
      //   },
      // ]);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updatePlacaengancheDto: UpdatePlacaenganchesDto) {
    const placaenganche = await this.findOne(id);
    try {
      if (!placaenganche) {
        throw new BadRequestException('Placa de enganche no encontrada');
      }
      await placaenganche.updateOne(updatePlacaengancheDto);
      return { ...placaenganche.toJSON(), ...updatePlacaengancheDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.placaenganchesModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `placa de enganche exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create placa de enganche - Check server logs`,
    );
  }
}
