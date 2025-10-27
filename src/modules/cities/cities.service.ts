import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel(City.name)
    private readonly cityModel: ModelExt<City>,
  ) {}

  async create(createCityDto: CreateCityDto) {
    try {
      const city = await this.cityModel.create(createCityDto);
      return city;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.cityModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.cityModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findById(id: string) {
    try {
      return await this.cityModel.find({
        state_id: id,
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findBynumber(id: string) {
    try {
      return await this.cityModel.find({
        id: id,
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateCityDto: UpdateCityDto) {
    const city = await this.findOne(id);
    try {
      if (!city) {
        throw new NotFoundException('Ciudad no encontrada');
      }
      await city.updateOne(updateCityDto);
      return {
        ...city.toJSON(),
        ...updateCityDto,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.cityModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `City exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create city - Check server logs`,
    );
  }
}
