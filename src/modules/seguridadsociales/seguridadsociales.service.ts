import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateSeguridadsocialeDto } from './dto/create-seguridadsociale.dto';
import { UpdateSeguridadsocialeDto } from './dto/update-seguridadsociale.dto';
import { Seguridadsociales } from './entities/seguridadsociales.entity';

@Injectable()
export class SeguridadsocialesService {
  constructor(
    @InjectModel(Seguridadsociales.name)
    private readonly seguridadsocialesModel: ModelExt<Seguridadsociales>,
  ) {}
  async create(createSeguridadsocialeDto: CreateSeguridadsocialeDto) {
    try {
      const seguridadsociales = await this.seguridadsocialesModel.create(
        createSeguridadsocialeDto,
      );
      return seguridadsociales;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.seguridadsocialesModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.seguridadsocialesModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findByResume(value: string) {
    try {
      return await this.seguridadsocialesModel
        .find({
          resume_id: value,
          deleted: false,
        })
        .populate({
          path: 'grupoentidad_id',
          select: { _id: 0, nombre_entidad: 1 },
        })
        .populate({
          path: 'tipoentidad_id',
          select: { _id: 0, entidad: 1 },
        })
        .select(
          '-_id -__v  -status -deleted -createdAt -updatedAt -resume_id -user_id',
        )
        .sort({ createdAt: -1 })
        .limit(4);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async insertManySeguridadSocial(
    createSeguridadsocialeDto: CreateSeguridadsocialeDto[],
  ) {
    return await this.seguridadsocialesModel.insertMany(
      createSeguridadsocialeDto,
    );
  }

  async updateManySeguridadSocial(
    updateSeguridadsocialeDto: UpdateSeguridadsocialeDto[],
  ) {
    //console.log('updateSeguridadsocialeDto: ', updateSeguridadsocialeDto);
    try {
      const arrayToUpdate = updateSeguridadsocialeDto;
      const savedIds: Types.ObjectId[] = [];
      let filter: any;
      for (const obj of arrayToUpdate) {
        if (obj.hasOwnProperty('_id') === false) {
          filter = { _id: new mongoose.Types.ObjectId() };
          console.log('no trae la propiedad', filter);
        } else {
          filter = { _id: obj._id, deleted: false };
          console.log('trae la propiedad', filter);
        }
        const update = {
          estado_afiliacion: obj.estado_afiliacion,
          fecha_afiliacion: obj.fecha_afiliacion,
          grupoentidad_id: obj.grupoentidad_id,
          observaciones: obj.observaciones,
          resume_id: obj.resume_id,
          status: obj.status,
          tipoentidad_id: obj.tipoentidad_id,
          user_id: obj.user_id,
        };
        await this.seguridadsocialesModel.updateOne(filter, update, {
          upsert: true,
        });
        const updated = await this.findOne(filter);
        if (!updated) {
          throw new BadRequestException('Seguridad social not found');
        }
        savedIds.push(updated._id as Types.ObjectId);
      }
      return savedIds;
    } catch (error) {
      console.log(error);
    }
  }

  async updateManySeguridadSocialPreservingIds(
    updateSeguridadsocialeDto: UpdateSeguridadsocialeDto[],
    existingSeguridadSociales: any[],
  ) {
    try {
      const savedIds: Types.ObjectId[] = [];
      const existingIds = new Set(
        existingSeguridadSociales.map((seg) => seg._id?.toString() || seg.toString()),
      );

      for (const newSeg of updateSeguridadsocialeDto) {
        if (newSeg._id && existingIds.has(newSeg._id.toString())) {
          // ACTUALIZAR seguridad social existente manteniendo su _id
          const update = {
            estado_afiliacion: newSeg.estado_afiliacion,
            fecha_afiliacion: newSeg.fecha_afiliacion,
            grupoentidad_id: newSeg.grupoentidad_id,
            observaciones: newSeg.observaciones,
            resume_id: newSeg.resume_id,
            status: newSeg.status,
            tipoentidad_id: newSeg.tipoentidad_id,
            user_id: newSeg.user_id,
          };

          await this.seguridadsocialesModel.updateOne(
            { _id: newSeg._id, deleted: false },
            update,
          );

          savedIds.push(new Types.ObjectId(newSeg._id));
          console.log(`✅ Seguridad Social actualizada: ${newSeg._id}`);
        } else {
          // CREAR nueva seguridad social
          const { _id, ...segData } = newSeg as any;
          delete segData.__v;
          const created = await this.seguridadsocialesModel.create(segData);
          savedIds.push(created._id as Types.ObjectId);
          console.log(`✨ Nueva Seguridad Social creada: ${created._id}`);
        }
      }

      return savedIds;
    } catch (error) {
      console.log('Error en updateManySeguridadSocialPreservingIds:', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateSeguridadsocialeDto: UpdateSeguridadsocialeDto,
  ) {
    const seguridadsociales = await this.findOne(id);
    try {
      if (!seguridadsociales) {
        throw new BadRequestException('Seguridad social not found');
      }
      await seguridadsociales.updateOne(updateSeguridadsocialeDto);
      return { ...seguridadsociales.toJSON(), ...updateSeguridadsocialeDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.seguridadsocialesModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Seguridad sociales exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Seguridad sociales - Check server logs`,
    );
  }
}
