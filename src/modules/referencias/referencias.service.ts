import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateReferenciaDto } from './dto/create-referencia.dto';
import { UpdateReferenciaDto } from './dto/update-referencia.dto';
import { Referencias } from './entities/referencias.entity';
import { CitiesService } from '../cities/cities.service';
import { CountriesService } from '../countries/countries.service';
import { StatesService } from '../states/states.service';

@Injectable()
export class ReferenciasService {
  constructor(
    @InjectModel(Referencias.name)
    private readonly referenciasModel: ModelExt<Referencias>,
    private readonly coutriesModel: CountriesService,
    private readonly statesModel: StatesService,
    private readonly citiesModel: CitiesService,
  ) {}

  async create(createReferenciaDto: CreateReferenciaDto) {
    try {
      const referencias = await this.referenciasModel.create(
        createReferenciaDto,
      );
      return referencias;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.referenciasModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.referenciasModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByResume(value: string) {
    try {
      return await this.referenciasModel
        .find({
          resume_id: value,
          deleted: false,
        })
        .populate([
          {
            path: 'relacion',
            select: 'nombre_tiporelacion -_id',
          },
        ])
        .select(
          '-_id -__v -createdAt -updatedAt -status -deleted -resume_id -user_id',
        );
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async insertManyReferencia(createReferenciaDto: CreateReferenciaDto[]) {
    return await this.referenciasModel.insertMany(createReferenciaDto);
  }

  // ajustar metodo
  async updateManyReferencia(updateReferenciaDto: UpdateReferenciaDto[]) {
    //console.log('updateReferenciaDto: ', updateReferenciaDto);
    try {
      const arrayToUpdate = updateReferenciaDto;
      const savedIds: Types.ObjectId[] = [];
      for (const obj of arrayToUpdate) {
        let filter: any;
        //console.log(obj);

        if (obj.hasOwnProperty('_id') === false) {
          filter = { _id: new mongoose.Types.ObjectId() };
          console.log('no trae la propiedad', filter);
        } else {
          filter = { _id: new Types.ObjectId(obj._id as any), deleted: false };
          console.log('trae la propiedad', filter);
        }
        const update = {
          ciudad_referencia: obj.ciudad_referencia,
          direccion: obj.direccion,
          estado_referencia: obj.estado_referencia,
          nombre_completo: obj.nombre_completo,
          pais_referencia: obj.pais_referencia,
          relacion: obj.relacion,
          resume_id: obj.resume_id,
          status: obj.status,
          telefonos: obj.telefonos,
          user_id: obj.user_id,
        };
        await this.referenciasModel.updateOne(filter, update, {
          upsert: true,
        });
        savedIds.push(filter._id as Types.ObjectId);
      }
      return savedIds;
    } catch (error) {
      console.log(error);
    }
  }

  async updateManyReferenciaPreservingIds(
    updateReferenciaDto: UpdateReferenciaDto[],
    existingReferencias: any[],
  ) {
    try {
      const savedIds: Types.ObjectId[] = [];
      const existingIds = new Set(
        existingReferencias.map((ref) => ref._id?.toString() || ref.toString()),
      );

      for (const newRef of updateReferenciaDto) {
        if (newRef._id && existingIds.has(newRef._id.toString())) {
          // ACTUALIZAR referencia existente manteniendo su _id
          const update = {
            ciudad_referencia: newRef.ciudad_referencia,
            direccion: newRef.direccion,
            estado_referencia: newRef.estado_referencia,
            nombre_completo: newRef.nombre_completo,
            pais_referencia: newRef.pais_referencia,
            relacion: newRef.relacion,
            resume_id: newRef.resume_id,
            status: newRef.status,
            telefonos: newRef.telefonos,
            user_id: newRef.user_id,
          };

          await this.referenciasModel.updateOne(
            { _id: newRef._id, deleted: false },
            update,
          );

          savedIds.push(new Types.ObjectId(newRef._id as any));
          console.log(`✅ Referencia actualizada: ${newRef._id}`);
        } else {
          // CREAR nueva referencia
          const { _id, ...refData } = newRef as any;
          delete refData.__v;
          const created = await this.referenciasModel.create(refData);
          savedIds.push(created._id as Types.ObjectId);
          console.log(`✨ Nueva referencia creada: ${created._id}`);
        }
      }

      return savedIds;
    } catch (error) {
      console.log('Error en updateManyReferenciaPreservingIds:', error);
      throw error;
    }
  }

  async update(id: string, updateReferenciaDto: UpdateReferenciaDto) {
    const referencia = await this.findOne(id);
    try {
      if (!referencia) {
        throw new BadRequestException('Referencia no encontrada');
      }
      await referencia.updateOne(updateReferenciaDto);
      return { ...referencia.toJSON(), ...updateReferenciaDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.referenciasModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Referencias exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create referencias - Check server logs`,
    );
  }
}
