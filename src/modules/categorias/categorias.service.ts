import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categorias } from './entities/categorias.entity';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel(Categorias.name)
    private readonly categoriasModel: ModelExt<Categorias>,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    try {
      const categoria = await this.categoriasModel.create(createCategoriaDto);
      return categoria;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.categoriasModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.categoriasModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.findOne(id);
    try {
      if (!categoria) {
        throw new NotFoundException('Categoría no encontrada');
      }
      await categoria.updateOne(updateCategoriaDto);
      return { ...categoria.toJSON(), ...updateCategoriaDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.categoriasModel.delete({ _id });
    return resp;
  }
  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Categoria exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Categoria - Check server logs`,
    );
  }
}
