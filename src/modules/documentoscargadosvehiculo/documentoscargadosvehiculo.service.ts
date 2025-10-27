import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateDocumentoscargadosvehiculoDto } from './dto/create-documentoscargadosvehiculo.dto';
import { UpdateDocumentoscargadosvehiculoDto } from './dto/update-documentoscargadosvehiculo.dto';
import { Documentoscargadosvehiculo } from './entities/documentoscargadosvehiculo.entity';
import { FindUserDocumentoDto } from './dto/find-userdocumentovencido.dto';

@Injectable()
export class DocumentoscargadosvehiculoService {
  constructor(
    @InjectModel(Documentoscargadosvehiculo.name)
    private readonly documentoscargadosvehiculoModel: ModelExt<Documentoscargadosvehiculo>,
  ) {}

  async create(
    createDocumentoscargadosvehiculoDto: CreateDocumentoscargadosvehiculoDto,
  ) {
    try {
      const documentoscargadosresume =
        await this.documentoscargadosvehiculoModel.create(
          createDocumentoscargadosvehiculoDto,
        );
      return documentoscargadosresume;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.documentoscargadosvehiculoModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.documentoscargadosvehiculoModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findByResumeVehicle(id: string) {
    try {
      const filter = {
        resumevehicle_id: id,
      };
      //console.log(filter.resumevehicle_id);
      return await this.documentoscargadosvehiculoModel
        .find(filter)
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
        .select(
          '-resumevehicle_id -__v -_id -deleted -createdAt -updatedAt -user_id',
        )
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
      const expiredDocuments = await this.documentoscargadosvehiculoModel
        .find(filter)
        .populate([
          {
            path: 'documento_id',
            select: 'nombre_documento _id',
          },
        ])
        .select('-__v');

      for (const obj of expiredDocuments) {
        if (!obj) {
          throw new BadRequestException('Documento cargado vehiculo no encontrado');
        }
        obj.estado_documento = 2;
        await this.documentoscargadosvehiculoModel.updateOne({ _id: obj._id as any }, { estado_documento: 2 });
      }

      return expiredDocuments;
    } catch (error) {
      return error;
    }
  }

  async insertManyDocumentoscargadosresume(
    createDocumentoscargadosvehiculoDto: CreateDocumentoscargadosvehiculoDto[],
  ) {
    return await this.documentoscargadosvehiculoModel.insertMany(
      createDocumentoscargadosvehiculoDto,
    );
  }

  async updateManyDocumentoscargadosresume(
    updateDocumentoscargadosvehiculoDto: UpdateDocumentoscargadosvehiculoDto[],
  ) {
    try {
      if (!updateDocumentoscargadosvehiculoDto || updateDocumentoscargadosvehiculoDto.length === 0) {
        return [];
      }
      
      const arrayToUpdate = updateDocumentoscargadosvehiculoDto;
      const savedIds: Types.ObjectId[] = [];
      
      for (const obj of arrayToUpdate) {
        let filter: any;
        let documentId: string | mongoose.Types.ObjectId;
        
        if (!obj._id || obj._id === '' || obj._id === null) {
          // Crear nuevo documento si no tiene _id válido
          const newId = new mongoose.Types.ObjectId();
          documentId = newId;
          filter = { _id: newId };
          console.log('Creando nuevo documento con ID:', newId.toString());
        } else {
          // Actualizar documento existente
          documentId = obj._id;
          filter = { _id: obj._id };
          console.log('Actualizando documento existente:', obj._id);
        }
        
        const update = {
          categoria: obj.categoria,
          codigo_referencia: obj.codigo_referencia,
          documento: obj.documento,
          documento_id: obj.documento_id,
          entidad_emisora: obj.entidad_emisora,
          estado_documento: obj.estado_documento !== undefined ? obj.estado_documento : 1,
          fecha_expedicion: obj.fecha_expedicion,
          fecha_vencimiento: obj.fecha_vencimiento,
          grupodocumento_id: obj.grupodocumento_id,
          nombre: obj.nombre,
          observaciones: obj.observaciones,
          resumevehicle_id: obj.resumevehicle_id,
          user_id: obj.user_id,
        };
        
        const result = await this.documentoscargadosvehiculoModel.updateOne(
          filter, 
          update, 
          { upsert: true }
        );
        
        console.log('Resultado de updateOne:', result);
        
        // Buscar el documento actualizado usando el ID correcto
        const updated = await this.documentoscargadosvehiculoModel.findById(documentId);
        if (updated) {
          console.log('Documento guardado correctamente:', updated._id);
          savedIds.push(updated._id as unknown as Types.ObjectId);
        } else {
          console.error('No se pudo encontrar el documento después de guardarlo:', documentId);
        }
      }
      
      console.log('IDs guardados:', savedIds);
      return savedIds;
    } catch (error) {
      console.error('Error en updateManyDocumentoscargadosresume:', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateDocumentoscargadosvehiculoDto: UpdateDocumentoscargadosvehiculoDto,
  ) {
    const documentoscargadosvehiculo = await this.findOne(id);
    try {
      if (!documentoscargadosvehiculo) {
        throw new BadRequestException('Documento de vehículo no encontrado');
      }
      await documentoscargadosvehiculo.updateOne(
        updateDocumentoscargadosvehiculoDto,
      );
      return {
        ...documentoscargadosvehiculo.toJSON(),
        ...updateDocumentoscargadosvehiculoDto,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async updateImagen(id: string, filename: string) {
    const documentoscargadosvehiculo = await this.findOne(id);
    
    if (!documentoscargadosvehiculo) {
      throw new BadRequestException('Documento de vehículo no encontrado');
    }
    
    try {
      await documentoscargadosvehiculo.updateOne({ documento: filename });
      return {
        ...documentoscargadosvehiculo.toJSON(),
        documento: filename,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.documentoscargadosvehiculoModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Documento cargado vehiculo exists in db ${JSON.stringify(
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
