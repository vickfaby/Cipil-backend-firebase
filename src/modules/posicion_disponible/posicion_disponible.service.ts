import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePosiciondisponibleDto } from './dto/create-posicion_disponible.dto';
import { UpdatePosiciondisponibleDto } from './dto/update-posicion_disponible.dto';
import { Posiciondisponible } from './entities/posicion_disponible.entity';
import { Resume } from '../resume/entities/resume.entity';
import { Resumevehiculo } from '../resumevehiculo/entities/resumevehiculo.entity';

@Injectable()
export class PosiciondisponibleService {
  constructor(
    @InjectModel(Posiciondisponible.name)
    private readonly posiciondisponibleModel: Model<Posiciondisponible>,
    @InjectModel(Resume.name)
    private readonly resumeModel: Model<Resume>,
    @InjectModel(Resumevehiculo.name)
    private readonly resumevehiculoModel: Model<Resumevehiculo>,
  ) {}

  async create(createPosiciondisponibleDto: CreatePosiciondisponibleDto) {
    const { resume_id, resumevehiculo_id } = createPosiciondisponibleDto;

    if (!resume_id && !resumevehiculo_id) {
      throw new BadRequestException(
        'Debe proporcionar al menos un resume_id o un resumevehiculo_id',
      );
    }

    if (resume_id && resumevehiculo_id) {
      throw new BadRequestException(
        'No puede proporcionar ambos resume_id y resumevehiculo_id al mismo tiempo',
      );
    }

    if (resume_id) {
      const resume = await this.resumeModel.findById(resume_id);
      if (!resume) {
        throw new NotFoundException(`Resume con id ${resume_id} no encontrado`);
      }
    }

    if (resumevehiculo_id) {
      const resumevehiculo = await this.resumevehiculoModel.findById(
        resumevehiculo_id,
      );
      if (!resumevehiculo) {
        throw new NotFoundException(
          `ResumeVehiculo con id ${resumevehiculo_id} no encontrado`,
        );
      }
    }

    return this.posiciondisponibleModel.create(createPosiciondisponibleDto);
  }

  findAll() {
    return this.posiciondisponibleModel.find().exec();
  }

  findOne(id: string) {
    return this.posiciondisponibleModel.findById(id).exec();
  }

  update(id: string, updatePosiciondisponibleDto: UpdatePosiciondisponibleDto) {
    return this.posiciondisponibleModel
      .findByIdAndUpdate(id, updatePosiciondisponibleDto, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.posiciondisponibleModel.findByIdAndDelete(id).exec();
  }
}

