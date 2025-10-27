import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country.name)
    private readonly countryModel: ModelExt<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto) {
    try {
      const country = await this.countryModel.create(createCountryDto);
      return country;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.countryModel.find({}).select('-_id -__v');
  }

  async findOne(id: string) {
    try {
      return await this.countryModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findById(id: string) {
    try {
      return await this.countryModel.find({
        id: id,
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateCountryDto: UpdateCountryDto) {
    const country = await this.findOne(id);
    try {
      if (!country) {
        throw new NotFoundException('País no encontrado');
      }
      await country.updateOne(updateCountryDto);
      return {
        ...country.toJSON(),
        ...updateCountryDto,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.countryModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Country exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create country - Check server logs`,
    );
  }
}
