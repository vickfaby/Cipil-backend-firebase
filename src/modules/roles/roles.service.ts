import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Roles.name)
    private readonly rolesModel: ModelExt<Roles>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    try {
      const role = await this.rolesModel.create(createRoleDto);
      return role;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.rolesModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.rolesModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    try {
      if (!role) {
        throw new BadRequestException('Role not found');
      }
      await role.updateOne(updateRoleDto);
      return { ...role.toJSON(), ...updateRoleDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.rolesModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Role exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Role - Check server logs`,
    );
  }
}
