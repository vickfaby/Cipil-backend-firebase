import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model, Types } from 'mongoose';
import { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { State } from './entities/state.entity';

@Injectable()
export class StatesService {
  constructor(
    @InjectModel(State.name)
    private readonly stateModel: Model<State>,
  ) {}

  async create(createStateDto: CreateStateDto) {
    try {
      const state = await this.stateModel.create(createStateDto);
      return state;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.stateModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.stateModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findById(id: string) {
    try {
      return await this.stateModel.find({
        country_id: id,
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findBynumber(id: string) {
    try {
      return await this.stateModel.find({
        id: id,
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateStateDto: UpdateStateDto) {
    const state = await this.findOne(id);
    try {
      if (!state) {
        throw new BadRequestException('State not found');
      }
      await state.updateOne(updateStateDto);
      return {
        ...state.toJSON(),
        ...updateStateDto,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    const _id:any = new Types.ObjectId(id);
    return this.stateModel.deleteOne({ _id });
  }
  
  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `State exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create state - Check server logs`,
    );
  }
}
