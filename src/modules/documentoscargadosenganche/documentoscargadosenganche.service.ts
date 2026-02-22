import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateDocumentoscargadosengancheDto } from './dto/create-documentoscargadosenganche.dto';
import { UpdateDocumentoscargadosengancheDto } from './dto/update-documentoscargadosenganche.dto';
import { Documentoscargadosenganche } from './entities/documentoscargadosenganche.entity';
import { FindUserDocumentoDto } from './dto/find-userdocumentovencido.dto';

@Injectable()
export class DocumentoscargadosengancheService {
  constructor(
    @InjectModel(Documentoscargadosenganche.name)
    private readonly documentoscargadosengancheModel: ModelExt<Documentoscargadosenganche>,
  ) {}

  async create(
    createDocumentoscargadosengancheDto: CreateDocumentoscargadosengancheDto,
  ) {
    try {
      const documentoscargadosresume =
        await this.documentoscargadosengancheModel.create(
          createDocumentoscargadosengancheDto,
        );
      return documentoscargadosresume;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.documentoscargadosengancheModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.documentoscargadosengancheModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findByPlaca(placa: string) {
    try {
      return await this.documentoscargadosengancheModel
        .find({
          placa_enganche: placa,
          deleted: false,
        })
        .populate([
          {
            path: 'documento_id',
            select: 'nombre_documento _id',
            populate: {
              path: 'grupodocumento',
              select: 'nombre_documento _id',
            },
          },
        ])
        .populate([
          {
            path: 'entidad_emisora',
            select: 'nombre_entidad _id',
          },
        ]);
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findByResumeVehicle(resumevehicle: string) {
    try {
      return await this.documentoscargadosengancheModel
        .find({
          placa_enganche: resumevehicle,
          deleted: false,
        })
        .populate([
          {
            path: 'grupodocumento_id',
            select: 'nombre_documento -_id',
          },
        ])
        .populate([
          {
            path: 'documento_id',
            select: 'nombre_documento -_id',
          },
        ])
        .populate([
          {
            path: 'entidad_emisora',
            select: 'nombre_entidad -_id',
          },
        ])
        .select('-__v -_id -deleted -createdAt -updatedAt -user_id')
        .sort({ createAt: 1 });
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findByUser(findUserDocumentoDto: FindUserDocumentoDto) {
    try {
      const filter = {
        user_id: new Types.ObjectId(findUserDocumentoDto.user_id),
        fecha_vencimiento: { $lte: findUserDocumentoDto.date },
        deleted: false,
      };
      const expiredDocuments = await this.documentoscargadosengancheModel
        .find(filter)
        .populate([
          {
            path: 'documento_id',
            select: 'nombre_documento _id',
          },
        ])
        .select('-__v');

      for (const obj of expiredDocuments) {
        obj.estado_documento = 2;
        await this.documentoscargadosengancheModel.updateOne(
          { _id: obj._id as any },
          { $set: { estado_documento: 2 } },
        );
      }

      return expiredDocuments;
    } catch (error) {
      return error;
    }
  }
  async insertManyDocumentoscargadosenganche(
    createDocumentoscargadosengancheDto: CreateDocumentoscargadosengancheDto[],
  ) {
    return await this.documentoscargadosengancheModel.insertMany(
      createDocumentoscargadosengancheDto,
    );
  }

  /**
   * Normalize a reference field from frontend: accept string ID or populated object with _id/id.
   * Returns a string suitable for ObjectId, or undefined if not resolvable.
   */
  private toObjectIdString(value: any): string | undefined {
    if (value == null) return undefined;
    if (typeof value === 'string') {
      return value.trim() || undefined;
    }
    if (typeof value === 'object') {
      const id = value._id ?? value.id;
      if (id != null) return typeof id === 'string' ? id : String(id);
    }
    return undefined;
  }

  async updateManyDocumentoscargadosenganche(
    updateDocumentoscargadosengancheDto: UpdateDocumentoscargadosengancheDto[],
  ) {
    try {
      const arrayToUpdate = updateDocumentoscargadosengancheDto;
      const savedIds: Types.ObjectId[] = [];
      let filter: { _id: Types.ObjectId; deleted?: boolean };
      for (const obj of arrayToUpdate) {
        const existingId = this.toObjectIdString(obj._id);
        if (!existingId) {
          filter = { _id: new mongoose.Types.ObjectId() };
        } else {
          filter = { _id: new Types.ObjectId(existingId), deleted: false };
        }
        const documentoId = this.toObjectIdString(obj.documento_id);
        const grupodocumentoId = this.toObjectIdString(obj.grupodocumento_id);
        const entidadEmisoraId = this.toObjectIdString(obj.entidad_emisora);
        const userId = this.toObjectIdString(obj.user_id);

        const update: Record<string, any> = {
          categoria: obj.categoria,
          codigo_referencia: obj.codigo_referencia,
          documento: obj.documento,
          estado_documento: obj.estado_documento,
          fecha_expedicion: obj.fecha_expedicion,
          fecha_vencimiento: obj.fecha_vencimiento,
          nombre: obj.nombre,
          observaciones: obj.observaciones,
          placa_enganche: obj.placa_enganche,
        };
        if (documentoId != null) update.documento_id = documentoId;
        if (grupodocumentoId != null) update.grupodocumento_id = grupodocumentoId;
        if (entidadEmisoraId != null) update.entidad_emisora = entidadEmisoraId;
        if (userId != null) update.user_id = userId;

        await this.documentoscargadosengancheModel.updateOne(filter, update, {
          upsert: true,
        });
        savedIds.push(filter._id);
      }
      return savedIds;
    } catch (error) {
      console.log(error);
    }
  }

  async update(
    id: string,
    updateDocumentoscargadosengancheDto: UpdateDocumentoscargadosengancheDto,
  ) {
    const documentoscargadosenganche = await this.findOne(id);
    try {
      if (!documentoscargadosenganche) {
        throw new BadRequestException('Documento cargado enganche no encontrado');
      }
      await documentoscargadosenganche.updateOne(
        updateDocumentoscargadosengancheDto,
      );
      return {
        ...documentoscargadosenganche.toJSON(),
        ...updateDocumentoscargadosengancheDto,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.documentoscargadosengancheModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Documento cargado enganche exists in db ${JSON.stringify(
          error.keyValue,
        )}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Documento cargado vehiculo - Check server logs`,
    );
  }
}
